import { api, LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//Import Apex class
import getMultiplePicklistValues from "@salesforce/apex/PicklistController.getMultiplePicklistValues";
import insertContact from "@salesforce/apex/contactController.insertContact";

const objectApiName = "Contact";
const fields = [
  "Gender__c",
  "Employment_Type__c",
  "Current_Employee_Type__c",
  "Employee_Status__c",
  "Employee_Status_PE1__c",
  "Employee_Status_PE2__c",
  "Bachelors_Degree__c",
  "Masters_Degree__c",
  "Highest_Qualification__c"
];

export default class ContactForm extends LightningElement {
  @track picklistOptionsMap = {};
  @track contact = {};
  activeSections = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

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
    console.log(event.target.value);
    this.contact[field] = event.target.value;
  }

  handlePicklistChange(event) {
    const field = event.target.dataset.field;
    console.log(event.detail.value);
    this.contact[field] = event.detail.value;
  }

  handleLookUp(event) {
    const field = event.target.dataset.field;
    this.contact[field] = event.detail.selectedRecord
      ? event.detail.selectedRecord.Id
      : null;
    console.log(field + " : " + this.contact[field]);
  }

  appData;
  @api contactId;
  handleSaveClick() {
    this.appData = JSON.stringify(this.contact);
    console.log(this.appData);
    insertContact({ contactData: this.appData })
      .then((result) => {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.contactId = result.Id;
        console.log("Contact record ID => " + this.contactId);
        this.showToast("Success", "Contact saved successfully", "success");
      })
      .catch((error) => {
        console.log("Error while Saving => " + JSON.stringify(error));
        this.showToast("Contact Not Saved", error.body.message, "error");
      });
  }
}
