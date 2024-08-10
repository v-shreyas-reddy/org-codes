import { LightningElement, track, api } from "lwc";
import getMultiplePicklistValues from "@salesforce/apex/PicklistController.getMultiplePicklistValues";

import insertResourceRecord from "@salesforce/apex/ResourceController.insertResource";

export default class FormResource extends LightningElement {
  @track picklistOptionsMap = {};
  @track resource = {};

  connectedCallback() {
    this.fetchMultiplePicklistValues();
  }

  fetchMultiplePicklistValues() {
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
    getMultiplePicklistValues({ objectName: "Resource__c", fieldNames: fields })
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
    // console.log("Field:--- ", field, "data:---", this.resource[field]);
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
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.resourceId = result.Id;
        console.log("Resource record ID=====: " + this.resourceId);
        // this.showToast("Success", "Resource saved successfully", "success");
        // this.handleApproval();
      })
      .catch((error) => {
        console.log("Error while Saving=====> " + JSON.stringify(error));
        // this.showToast("Resource Not Saved", error.body.message, "error");
      });
  }
}
