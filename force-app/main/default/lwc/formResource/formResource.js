import { LightningElement, track, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getMultiplePicklistValues from "@salesforce/apex/PicklistController.getMultiplePicklistValues";
import ACCOUNTS from "@salesforce/apex/AccountController.getAllAccounts";
import OPPORTUNITIES from "@salesforce/apex/OpportunityController.getAllOpps";

import insertResourceRecord from "@salesforce/apex/ResourceController.insertResource";

import submitForApproval from "@salesforce/apex/ApprovalProcessController.submitForApproval";
import getUsersInApprovalProcess from "@salesforce/apex/ApprovalProcessController.getUsersInApprovalProcess";

const objectApiName = "Resource__c";
const fields = [
  "Client_Interview_Required__c",
  "Department__c",
  "Location__c",
  "Type__c",
  "Employment_Type__c",
  "Job_Location__c",
  "Client_Name__c",
  "Expertise_Area__c",
  "Onsite_Interview_Required__c",
  "Level_Grade__c",
  "Priority__c",
  "Title__c",
  "Billability__c",
  "Shift_Timings__c"
];

export default class FormResource extends LightningElement {
  @track picklistOptionsMap = {};
  @track resource = {};
  oppOptions = [];
  accountOptions = [];

  /* Modal popup logic */
  @track isShowModal = false;
  showModalBox() {
    this.isShowModal = true;
  }
  hideModalBox() {
    this.isShowModal = false;
  }

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

  connectedCallback() {
    this.fetchMultiplePicklistValues();
  }

  fetchMultiplePicklistValues() {
    getMultiplePicklistValues({ objectName: objectApiName, fieldNames: fields })
      .then((result) => {
        this.picklistOptionsMap = {};
        // eslint-disable-next-line guard-for-in
        for (let field in result) {
          this.picklistOptionsMap[field] = result[field].map((item) => ({
            label: item.Label,
            value: item.Value
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching picklist values", error);
      });
  }

  handleInputChange(event) {
    const field = event.target.dataset.field;
    this.resource[field] = event.target.value;
    // console.log("Field:--- ", field, "data:---", this.resource[field]);
  }
  handlePicklistChange(event) {
    const field = event.target.dataset.field;
    this.resource[field] = event.detail.value;
    // console.log("Field:--- " + field + " data:--- " + this.resource[field]);
  }

  appdata;
  @api resourceId; // property of resourceId after insertion
  handleSaveClick() {
    this.appdata = JSON.stringify(this.resource);
    insertResourceRecord({ resourceData: this.appdata })
      .then((result) => {
        // console.log("Result: " + JSON.stringify(result));
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.resourceId = result.Id;
        console.log("Resource record ID=====: " + this.resourceId);
        this.showToast("Success", "Resource saved successfully", "success");
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

  // Wire the Apex method to fetch approvers when the recordId changes
  approvers = [];
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
}