import { LightningElement, wire, api, track } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'; //toast event import
import { getPicklistValues, getObjectInfo} from 'lightning/uiObjectInfoApi'; //picklist and object import

import insertInterviewFeedback from '@salesforce/apex/InterviewFeedbackController.insertFeedback';

import INTERVIEW_FEEDBACK_OBJECT from '@salesforce/schema/Interview_Feedback__c'; //interview feedback object import
import STATUS from '@salesforce/schema/Interview_Feedback__c.Status__c'; //status field import

export default class FeedbackCmp extends LightningElement {

    feedbackFields = {
        Candidate_name__c: '',
        Solutioning_skills__c: '',
        Communication_skills__c: '',
        Status__c: ''
    }


    //toast Event function
    showToast(title,message,variant){
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(toastEvent);
    }

    //page Refresh function
    pageRefresh(){
        setTimeout(() => {
            location.reload();
        }, 2000); // 2000 milliseconds = 2 seconds
    }

    //Save button function
    handleSaveClick(){
        insertInterviewFeedback({feedbackData: this.feedbackFields})
        .then((result)=>{
            console.log('Result: '+JSON.stringify(result));
            this.showToast('Record Saved','Record Saved Successfully','success');
            //this.pageRefresh();
        })
        .catch((error) =>{
            console.log('Error: '+JSON.stringify(error));
            this.showToast('Record Not Saved',error.body.message,'error');
        })
    }

    @wire(getObjectInfo, {objectApiName: INTERVIEW_FEEDBACK_OBJECT})
    interviewFeedbackObj;

    @wire(getPicklistValues,{recordTypeId: '$interviewFeedbackObj.data.defaultRecordTypeId',fieldApiName: STATUS,})
    interviewFeedbackStatus;


    // changeHandler(event){
    //     const {value, name} = event.target
    //     this.feedbackFields = {...this.feedbackFields, [name]: value}
    // }

    handleSolRating(event){
        let rating = event.detail.rating;
        let finalRating = rating.toString();
        this.feedbackFields.Solutioning_skills__c = finalRating;
    }

    handleComRating(event){
        let rating = event.detail.rating;
        let finalRating = rating.toString();
        this.feedbackFields.Communication_skills__c = finalRating;
    }

    handleCanName(event){
        this.feedbackFields.Candidate_name__c = event.target.value;
    }

    handleStatus(event){
        this.feedbackFields.Status__c = event.detail.value;
    }

}