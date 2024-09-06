import { LightningElement, track, wire } from "lwc";
import getResources from "@salesforce/apex/ResourceController.getResources";
import getDepartmentPicklistValues from "@salesforce/apex/ResourceController.getDepartmentPicklistValues";
import getRecruiterOptions from "@salesforce/apex/ResourceController.getRecruiterOptions";

const columns = [
  {
    label: "Requester Name",
    fieldName: "requesterLink",
    type: "url",
    typeAttributes: {
      label: { fieldName: "Requester_Name__c" },
      target: "_self"
    }
  },
  { label: "Department", fieldName: "Department__c" },
  { label: "Status", fieldName: "Status__c" },
  { label: "Location", fieldName: "Location__c" }
];

export default class ResourcePage extends LightningElement {
  @track resList;
  @track columns = columns;
  @track error;

  @track departmentOptions = [];
  @track searchKey = "";
  @track selectedDepartment = "";
  @track recruiterValue = "";

  @track recruiterOptions = [];

  @wire(getRecruiterOptions)
  wiredRecruiters({ data, error }) {
    if (data) {
      // Map the recruiter values to picklist options
      this.recruiterOptions = data.map((recruiter) => {
        return { label: recruiter, value: recruiter };
      });
      this.recruiterOptions.unshift({ label: "All", value: "" });
    } else if (error) {
      this.error = error;
    }
  }

  connectedCallback() {
    this.fetchDeptPickValues();
  }

  // Fetch picklist values dynamically from server
  fetchDeptPickValues() {
    getDepartmentPicklistValues()
      .then((result) => {
        this.departmentOptions = [{ label: "All", value: "" }]; // Default option to show all departments
        result.forEach((department) => {
          this.departmentOptions.push({ label: department, value: department });
        });
      })
      .catch((error) => {
        this.error = error;
      });
  }

  @wire(getResources, {
    searchKey: "$searchKey",
    department: "$selectedDepartment",
    recruiter: "$recruiterValue"
  })
  wiredResources({ error, data }) {
    if (data) {
      this.resList = data.map((row) => {
        return {
          ...row,
          requesterLink: "/" + row.Id
        };
      });
    } else if (error) {
      this.error = error;
    }
  }

  handleSearchChange(event) {
    this.searchKey = event.target.value;
  }

  handleDepartment(event) {
    this.selectedDepartment = event.detail.value;
  }

  handleRecruiterChange(event) {
    this.recruiterValue = event.detail.value;
  }
}
