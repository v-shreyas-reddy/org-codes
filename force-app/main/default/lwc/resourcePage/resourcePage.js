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
  @track resList = [];
  @track columns = columns;
  @track error;

  @track departmentOptions = [];
  @track searchKey = "";
  @track selectedDepartment = "";
  @track recruiterValue = "";

  @track recruiterOptions = [];

  // Pagination tracking
  @track currentPage = 1;
  @track pageSize = 10;
  @track totalPages = 0;
  @track pages = [];
  @track totalRecords = 0;
  @track firstRow = 1;
  @track lastRow = 10;

  @track rowsPerPageOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" }
  ];

  @track isFirstPage = true;
  @track isLastPage = false;

  // Fetch recruiter options
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

  // Fetch department picklist values on component load
  connectedCallback() {
    this.fetchDeptPickValues();
    this.fetchData(); // Load the initial data when the component loads
  }

  // Fetch department picklist values from Apex
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

  // Fetch data from Apex (resources with pagination)
  fetchData() {
    getResources({
      searchKey: this.searchKey,
      department: this.selectedDepartment,
      recruiter: this.recruiterValue,
      pageSize: this.pageSize,
      pageNumber: this.currentPage
    })
      .then((result) => {
        this.resList = result.resources.map((row) => {
          return {
            ...row,
            requesterLink: "/" + row.Id
          };
        });

        this.totalRecords = result.totalRecords;

        // Calculate total pages
        this.totalPages = Math.ceil(result.totalRecords / this.pageSize);

        // Calculate the current range of rows being displayed
        this.firstRow = (this.currentPage - 1) * this.pageSize + 1;
        this.lastRow = Math.min(
          this.currentPage * this.pageSize,
          this.totalRecords
        );

        // Generate visible page numbers for pagination (max of 5 pages visible at a time)
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(this.totalPages, this.currentPage + 2);

        if (endPage - startPage < 4) {
          if (startPage === 1) {
            endPage = Math.min(startPage + 4, this.totalPages);
          } else if (endPage === this.totalPages) {
            startPage = Math.max(endPage - 4, 1);
          }
        }

        this.pages = [];
        for (let i = startPage; i <= endPage; i++) {
          this.pages.push({
            label: i,
            class: i === this.currentPage ? "slds-button_brand" : ""
          });
        }

        // Update button states for pagination
        this.isFirstPage = this.currentPage === 1;
        this.isLastPage = this.currentPage === this.totalPages;
      })
      .catch((error) => {
        this.error = error;
        console.log(JSON.stringify(error));
      });
  }

  // Handle when rows per page is changed
  handleRowsPerPageChange(event) {
    this.pageSize = parseInt(event.detail.value, 10);
    this.currentPage = 1; // Reset to the first page when page size is changed
    this.fetchData();
  }

  // Handle when search input changes
  handleSearchChange(event) {
    this.searchKey = event.target.value;
    this.currentPage = 1;
    this.fetchData();
  }

  // Handle when department picklist value changes
  handleDepartment(event) {
    this.selectedDepartment = event.detail.value;
    this.currentPage = 1;
    this.fetchData();
  }

  // Handle when recruiter picklist value changes
  handleRecruiterChange(event) {
    this.recruiterValue = event.detail.value;
    this.currentPage = 1;
    this.fetchData();
  }

  // Handle Previous button click for pagination
  handlePrevious() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.fetchData();
    }
  }

  // Handle Next button click for pagination
  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.fetchData();
    }
  }

  // Handle direct page number click
  handlePageChange(event) {
    const selectedPage = parseInt(event.target.label, 10);
    if (selectedPage !== this.currentPage) {
      this.currentPage = selectedPage;
      this.fetchData();
    }
  }
}
