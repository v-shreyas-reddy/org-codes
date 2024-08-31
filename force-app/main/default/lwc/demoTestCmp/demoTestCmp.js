import { LightningElement } from "lwc";

export default class DemoTestCmp extends LightningElement {
  // handel custom lookup component event
  lookupRecord(event) {
    console.log(
      "Selected Record Value on Parent Component is " +
        JSON.stringify(event.detail.selectedRecord)
    );
  }

  // parentAccountSelectedRecord;
  // handleValueSelectedOnAccount(event) {
  //   this.parentAccountSelectedRecord = event.detail;
  // }
}
