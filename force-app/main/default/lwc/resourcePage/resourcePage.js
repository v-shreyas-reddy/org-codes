import { LightningElement, track, wire } from "lwc";
import getResources from "@salesforce/apex/ResourceController.getResources";
import getDepartmentPicklistValues from "@salesforce/apex/ResourceController.getDepartmentPicklistValues";
import getRecruiterOptions from "@salesforce/apex/ResourceController.getRecruiterOptions";

const PAGE_SIZE = 10;

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

  @track currentPage = 1;
  @track totalPages = 1;
  @track isFirstPage = true;
  @track isLastPage = false;

  connectedCallback() {
    this.fetchDeptPickValues();
  }

  @wire(getRecruiterOptions)
  wiredRecruiters({ data, error }) {
    if (data) {
      this.recruiterOptions = data.map((recruiter) => {
        return { label: recruiter, value: recruiter };
      });
      this.recruiterOptions.unshift({ label: "All", value: "" });
    } else if (error) {
      this.error = error;
    }
  }

  @wire(getResources, {
    searchKey: "$searchKey",
    department: "$selectedDepartment",
    recruiter: "$recruiterValue",
    limit: PAGE_SIZE,
    offset: "$offset"
  })
  wiredResources({ error, data }) {
    if (data) {
      this.resList = data.map((row) => {
        return {
          ...row,
          requesterLink: "/" + row.Id
        };
      });
      this.totalPages = Math.ceil(data.totalCount / PAGE_SIZE);
      this.isFirstPage = this.currentPage === 1;
      this.isLastPage = this.currentPage === this.totalPages;
    } else if (error) {
      this.error = error;
    }
  }

  handleSearchChange(event) {
    this.searchKey = event.target.value;
    this.currentPage = 1;
    this.fetchResources();
  }

  handleDepartment(event) {
    this.selectedDepartment = event.detail.value;
    this.currentPage = 1;
    this.fetchResources();
  }

  handleRecruiterChange(event) {
    this.recruiterValue = event.detail.value;
    this.currentPage = 1;
    this.fetchResources();
  }

  fetchDeptPickValues() {
    getDepartmentPicklistValues()
      .then((result) => {
        this.departmentOptions = [{ label: "All", value: "" }];
        result.forEach((department) => {
          this.departmentOptions.push({ label: department, value: department });
        });
      })
      .catch((error) => {
        this.error = error;
      });
  }

  get offset() {
    return (this.currentPage - 1) * PAGE_SIZE;
  }

  fetchResources() {
    // Re-fetch data based on current search, filters, and pagination
    return getResources({
      searchKey: this.searchKey,
      department: this.selectedDepartment,
      recruiter: this.recruiterValue,
      limit: PAGE_SIZE,
      offset: this.offset
    }).then((data) => {
      this.resList = data.map((row) => ({
        ...row,
        requesterLink: "/" + row.Id
      }));
    });
  }

  handlePreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.fetchResources();
    }
  }

  handleNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.fetchResources();
    }
  }
}
