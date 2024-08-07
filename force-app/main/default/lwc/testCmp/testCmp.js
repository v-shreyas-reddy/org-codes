/* eslint-disable @lwc/lwc/no-api-reassignments */
import { LightningElement, track, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";

// Apex class for insertion
import insertResourceRecord from "@salesforce/apex/ResourceController.insertResource";
import ACCOUNTS from "@salesforce/apex/AccountController.getAllAccounts";
import OPPORTUNITIES from "@salesforce/apex/OpportunityController.getAllOpps";

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

export default class TestCmp extends LightningElement {
  @track resource = {};

  //Toast event function
  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant
      })
    );
  }

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

  handleInputChange(event) {
    const field = event.target.dataset.field;
    // console.log("Field-----" + field);
    this.resource[field] = event.target.value;
    // console.log("data-----" + this.resource[field]);
  }

  handlePicklistChange(event) {
    const field = event.target.dataset.field;
    // console.log("Field----" + field);
    this.resource[field] = event.detail.value;
    // console.log("data-----" + this.resource[field]);
  }

  appdata;
  @api resourceId; // property of resourceId after insertion
  handleSaveClick() {
    // console.log("total data----" + this.resource);
    // console.log("Final resource data: " + JSON.stringify(this.resource));
    this.appdata = JSON.stringify(this.resource);
    insertResourceRecord({ resourceData: this.appdata })
      .then((result) => {
        // console.log("Result: " + JSON.stringify(result));
        this.resourceId = result.Id;
        console.log("Resource record ID=====: " + this.resourceId);
        this.showToast("Success", "Resource saved successfully", "success");
      })
      .catch((error) => {
        console.log("Error while Saving=====> " + JSON.stringify(error));
        this.showToast("Resource Not Saved", error.body.message, "error");
      });
  }
}
