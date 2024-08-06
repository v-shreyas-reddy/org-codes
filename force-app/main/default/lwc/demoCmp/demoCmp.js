import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/*------------------------OBJECT----------------------*/
import RESOURCE_OBJECT from '@salesforce/schema/Resource__c';

/*------------------------FIELDS----------------------*/
import Billability_FIELD from '@salesforce/schema/Resource__c.Billability__c';
import Billing_Rate_FIELD from '@salesforce/schema/Resource__c.Billing_Rate__c';
import Client_Interview_Required_FIELD from '@salesforce/schema/Resource__c.Client_Interview_Required__c';
import Client_Name_FIELD from '@salesforce/schema/Resource__c.Client_Name__c';
import Comments_FIELD from '@salesforce/schema/Resource__c.Comments__c';
import Currency_FIELD from '@salesforce/schema/Resource__c.Currency__c';
import Department_FIELD from '@salesforce/schema/Resource__c.Department__c';
import Employee_Name_Replacement_FIELD from '@salesforce/schema/Resource__c.Employee_Name_Replacement__c';
import Employment_Type_FIELD from '@salesforce/schema/Resource__c.Employment_Type__c';
import Expertise_Area_FIELD from '@salesforce/schema/Resource__c.Expertise_Area__c';
import Job_Location_FIELD from '@salesforce/schema/Resource__c.Job_Location__c';
import Onboarding_Date_FIELD from '@salesforce/schema/Resource__c.Onboarding_Date__c';
import Onsite_Interview_Required_FIELD from '@salesforce/schema/Resource__c.Onsite_Interview_Required__c';
import Positions_FIELD from '@salesforce/schema/Resource__c.Positions__c';
import Priority_FIELD from '@salesforce/schema/Resource__c.Priority__c';
import Project_Name_FIELD from '@salesforce/schema/Resource__c.Project_Name__c';
import Recruiter_Name_FIELD from '@salesforce/schema/Resource__c.Recruiter_Name__c';
import Recruitment_Start_Date_FIELD from '@salesforce/schema/Resource__c.Recruitment_Start_Date__c';
import Shift_Timings_FIELD from '@salesforce/schema/Resource__c.Shift_Timings__c';
import Title_FIELD from '@salesforce/schema/Resource__c.Title__c';
import Type_FIELD from '@salesforce/schema/Resource__c.Type__c';
import Requester_Name_FIELD from '@salesforce/schema/Resource__c.Requester_Name__c';
import Level_Grade_FIELD from '@salesforce/schema/Resource__c.Level_Grade__c';

export default class DemoCmp extends LightningElement {
    objectApiName = RESOURCE_OBJECT;
    fields = [
        Billing_Rate_FIELD,
        Client_Interview_Required_FIELD,
        Billability_FIELD,
        Client_Name_FIELD,
        Comments_FIELD,
        Currency_FIELD,
        Department_FIELD,
        Employee_Name_Replacement_FIELD,
        Employment_Type_FIELD,
        Expertise_Area_FIELD,
        Job_Location_FIELD,
        Onboarding_Date_FIELD,
        Onsite_Interview_Required_FIELD,
        Positions_FIELD,
        Priority_FIELD,
        Project_Name_FIELD,
        Recruiter_Name_FIELD,
        Recruitment_Start_Date_FIELD,
        Shift_Timings_FIELD,
        Title_FIELD,
        Type_FIELD,
        Requester_Name_FIELD,
        Level_Grade_FIELD,
    ];

    handleSuccess(event) {

        const recordId = event.detail.id;
        console.log("Record ID: " + recordId);
        const evt = new ShowToastEvent({
            title: "Resource created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }


}