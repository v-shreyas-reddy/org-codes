/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, track, wire, api } from "lwc";

import submitForApproval from "@salesforce/apex/ApprovalProcessController.submitForApproval";

import getUsersInApprovalProcess from "@salesforce/apex/ApprovalProcessController.getUsersInApprovalProcess";

import { ShowToastEvent } from "lightning/platformShowToastEvent"; //toast event import

import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi"; //picklist and object import

//Apex class imports
import insertResourceRecord from "@salesforce/apex/ResourceController.insertResource";
import ACCOUNTS from "@salesforce/apex/AccountController.getAllAccounts";
import OPPORTUNITIES from "@salesforce/apex/OpportunityController.getAllOpps";

//object imports
import RESOURCE_OBJECT from "@salesforce/schema/Resource__c";

import CLIENT_INTERVIEW_REQUIRED from "@salesforce/schema/Resource__c.Client_Interview_Required__c";
import DEPARTMENT from "@salesforce/schema/Resource__c.Department__c";
import LOCATION from "@salesforce/schema/Resource__c.Location__c";
import TYPE from "@salesforce/schema/Resource__c.Type__c";
import EMPLOYMENT_TYPE from "@salesforce/schema/Resource__c.Employment_Type__c";
import JOB_LOCATION from "@salesforce/schema/Resource__c.Job_Location__c";
import CLIENT_NAME from "@salesforce/schema/Resource__c.Client_Name__c";
import EXPERTISE_AREA from "@salesforce/schema/Resource__c.Expertise_Area__c";
import ONSITE_INTERVIEW_REQUIRED from "@salesforce/schema/Resource__c.Onsite_Interview_Required__c";
import LEVEL_GRADE from "@salesforce/schema/Resource__c.Level_Grade__c";
import PRIORITY from "@salesforce/schema/Resource__c.Priority__c";
import TITLE from "@salesforce/schema/Resource__c.Title__c";
import BILLABILITY from "@salesforce/schema/Resource__c.Billability__c";
import SHIFT_TIMINGS from "@salesforce/schema/Resource__c.Shift_Timings__c";

// modal box

export default class ObjectResourceCmp extends LightningElement {
  // pageRefresh(){
  //     setTimeout(() => {
  //         location.reload();
  //     }, 2000); // 2000 milliseconds = 2 seconds
  // }

  //Toast event function
  showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(toastEvent);
  }

  @track getResource = {
    Requester_Name__c: "",
    Recruiter_Name__c: "",
    Project_Name__c: "",
    Employee_Name_Replacement__c: "",
    Client_Name__c: "",
    Billability__c: "",
    Billing_Rate__c: "",
    Client_Interview_Required__c: "",
    Comments__c: "",
    Currency__c: "",
    Department__c: "",
    Employment_Type__c: "",
    Expertise_Area__c: "",
    Job_Location__c: "",
    Level_Grade__c: "",
    Location__c: "",
    Onboarding_Date__c: "",
    Onsite_Interview_Required__c: "",
    Positions__c: "",
    Priority__c: "",
    Recruitment_Start_Date__c: "",
    Shift_Timings__c: "",
    Title__c: "",
    Type__c: "",
    Opportunity__c: "",
    Account__c: ""
  };

  //Opportunity lookup method
  oppOptions = [];
  @wire(OPPORTUNITIES)
  wiredOpps({ error, data }) {
    if (data) {
      this.oppOptions = data.map((opportunity) => {
        return {
          label: opportunity.Name,
          value: opportunity.Id
        };
      });
    } else if (error) {
      console.log("Error: " + JSON.stringify(error));
    }
  }

  //Account lookup method
  accountOptions = [];
  @wire(ACCOUNTS)
  wiredAccounts({ error, data }) {
    if (data) {
      this.accountOptions = data.map((account) => {
        return {
          label: account.Name,
          value: account.Id
        };
      });
    } else if (error) {
      console.log("Error: " + JSON.stringify(error));
    }
  }

  /*HANDLE ONCHANGE FOR RESOURCE OBJECT*/
  handleOppChange(event) {
    this.getResource.Opportunity__c = event.detail.value;
  }
  handleAccountChange(event) {
    this.getResource.Account__c = event.detail.value;
  }

  handleRequesterName(event) {
    this.getResource.Requester_Name__c = event.target.value;
  }
  handleRecruiterName(event) {
    this.getResource.Recruiter_Name__c = event.target.value;
  }
  handleEmpName(event) {
    this.getResource.Employee_Name_Replacement__c = event.target.value;
  }
  handleProjectName(event) {
    this.getResource.Project_Name__c = event.target.value;
  }
  handleRecStartDate(event) {
    this.getResource.Recruitment_Start_Date__c = event.target.value;
  }
  handleOnbDate(event) {
    this.getResource.Onboarding_Date__c = event.target.value;
  }
  handleComments(event) {
    this.getResource.Comments__c = event.target.value;
  }
  handlePositions(event) {
    this.getResource.Positions__c = event.target.value;
  }
  handleBillRate(event) {
    this.getResource.Billing_Rate__c = event.target.value;
  }
  handleCurrency(event) {
    this.getResource.Currency__c = event.target.value;
  }
  //picklist handle change
  handleCir(event) {
    this.getResource.Client_Interview_Required__c = event.detail.value;
  }
  handleDept(event) {
    this.getResource.Department__c = event.detail.value;
  }
  handleLocation(event) {
    this.getResource.Location__c = event.detail.value;
  }
  handleType(event) {
    this.getResource.Type__c = event.detail.value;
  }
  handleEmpType(event) {
    this.getResource.Employment_Type__c = event.detail.value;
  }
  handleJobLoc(event) {
    this.getResource.Job_Location__c = event.detail.value;
  }
  handleClientName(event) {
    this.getResource.Client_Name__c = event.detail.value;
  }
  handleExpArea(event) {
    this.getResource.Expertise_Area__c = event.detail.value;
  }
  handleOnIntReq(event) {
    this.getResource.Onsite_Interview_Required__c = event.detail.value;
  }
  handleLevGr(event) {
    this.getResource.Level_Grade__c = event.detail.value;
  }
  handlePriority(event) {
    this.getResource.Priority__c = event.detail.value;
  }
  handleTitle(event) {
    this.getResource.Title__c = event.detail.value;
  }
  handleBillability(event) {
    this.getResource.Billability__c = event.detail.value;
  }
  handleShiftTiming(event) {
    this.getResource.Shift_Timings__c = event.detail.value;
  }

  /* GETTING OF OBJECTS */
  @wire(getObjectInfo, { objectApiName: RESOURCE_OBJECT })
  resourceObj;

  /*GETTING PICKLIST VALUES  OF RESOURCE OBJECT*/
  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: CLIENT_INTERVIEW_REQUIRED
  })
  resClientInterReq;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: DEPARTMENT
  })
  resDepartment;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: LOCATION
  })
  resLocation;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: TYPE
  })
  resType;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: EMPLOYMENT_TYPE
  })
  resEmpType;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: JOB_LOCATION
  })
  resJobLoc;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: CLIENT_NAME
  })
  resClientName;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: EXPERTISE_AREA
  })
  resExpArea;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: ONSITE_INTERVIEW_REQUIRED
  })
  resOnsiteInterReq;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: LEVEL_GRADE
  })
  resLevelGrade;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: PRIORITY
  })
  resPriority;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: TITLE
  })
  resTitle;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: BILLABILITY
  })
  resBillability;

  @wire(getPicklistValues, {
    recordTypeId: "$resourceObj.data.defaultRecordTypeId",
    fieldApiName: SHIFT_TIMINGS
  })
  resShiftTimings;

  //Save Button Logic
  @api resourceId; // property of resourceId after insertion
  handleSaveClick() {
    insertResourceRecord({ resourceData: this.getResource })
      .then((result) => {
        console.log("Result: " + JSON.stringify(result));
        this.resourceId = result.Id;
        this.showToast(
          "Resource Saved",
          "Resource Saved Successfully",
          "success"
        );
        // this.pageRefresh();
        this.handleApproval();
      })
      .catch((error) => {
        console.log("Error while Saving=====> " + JSON.stringify(error));
        this.showToast("Resource Not Saved", error.body.message, "error");
      });
  }

  handleApproval() {
    submitForApproval({ recordId: this.resourceId })
      .then((data) => {
        console.log("data from approval: " + data);
        this.showModalBox();
        this.handleApprovalUsers();
      })
      .catch((error) => {
        // Handle error, if needed
        console.error("Error submitting for approval:" + JSON.stringify(error));
      });
  }

  approvers = [];

  // Wire the Apex method to fetch approvers when the recordId changes
  handleApprovalUsers() {
    getUsersInApprovalProcess({ recordId: this.resourceId })
      .then((result) => {
        console.log("users: " + result);
        this.approvers = result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Modal popup logic */
  @track isShowModal = false;
  showModalBox() {
    this.isShowModal = true;
  }
  hideModalBox() {
    this.isShowModal = false;
  }
}