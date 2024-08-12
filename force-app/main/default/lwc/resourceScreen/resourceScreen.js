import { LightningElement, track } from "lwc";
import getMultiplePicklistValues from "@salesforce/apex/PicklistController.getMultiplePicklistValues";

export default class ResourceScreen extends LightningElement {
  @track inputValue = "";
  @track selectedValues = {};
  @track picklistOptionsMap = {};

  connectedCallback() {
    this.fetchMultiplePicklistValues();
  }

  fetchMultiplePicklistValues() {
    const fields = ["Industry", "Type"];
    getMultiplePicklistValues({ objectName: "Account", fieldNames: fields })
      .then((result) => {
        this.picklistOptionsMap = {};
        // Correctly map the result to the structure expected by lightning-combobox
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

  handlePicklistChange(event) {
    const fieldName = event.target.name;
    console.log(fieldName);
    this.selectedValues[fieldName] = event.target.value;
    console.log(this.selectedValues[fieldName]);
  }
}