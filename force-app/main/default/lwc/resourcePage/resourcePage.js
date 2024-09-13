import { LightningElement, track, wire } from "lwc";
import getResources from "@salesforce/apex/DatatableResourceController.getResources";
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
  { label: "Location", fieldName: "Location__c" },
  { label: "Status", fieldName: "Status__c" },
  {
    label: "Approvers",
    fieldName: "Approvers" // Updated field for Approvers data
  },
  { label: "Rejected", fieldName: "Rejected" } // Reference the Rejected field
];

export default class ResourcePage extends LightningElement {
  @track resList = [];
  @track columns = columns;
  @track error;

  @track departmentOptions = [];
  @track recruiterOptions = [];

  @track searchKey = "";
  @track selectedDepartment = "";
  @track recruiterValue = "";
  @track selectedStatus = ""; // Default to show all statuses

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

  fetchData() {
    //console.log("Fetching data with selected status: ", this.selectedStatus);
    getResources({
      searchKey: this.searchKey,
      department: this.selectedDepartment,
      recruiter: this.recruiterValue,
      status: this.selectedStatus, // Add status filter
      pageSize: this.pageSize,
      pageNumber: this.currentPage
    })
      .then((result) => {
        // console.log("Fetched Data:", JSON.stringify(result.resources)); // Log the resources data
        this.resList = result.resources.map((row) => {
          // console.log("Row Data:", row);
          let approvers = [];
          let rejecter = "";

          // Check level-1 status and add level-1 approver
          if (row.Level_1_Status__c === "Approved") {
            approvers.push(row.Level_1_Approver__c);
          }

          // Check level-2 status and add level-2 approver
          if (row.Level_2_Status__c === "Approved") {
            approvers.push(row.Level_2_Approver__c);
          }

          // Check level-3 status and add level-3 approver
          if (row.Level_3_Status__c === "Approved") {
            approvers.push(row.Level_3_Approver__c);
          }

          // Rejecters logic - prioritize based on level (Level 1 -> Level 3)
          if (row.Level_1_Status__c === "Rejected") {
            rejecter = row.Level_1_Rejecter__c; // Level 1 rejecter
          } else if (row.Level_2_Status__c === "Rejected") {
            rejecter = row.Level_2_Rejecter__c; // Level 2 rejecter
          } else if (row.Level_3_Status__c === "Rejected") {
            rejecter = row.Level_3_Rejecter__c; // Level 3 rejecter
          }

          return {
            ...row,
            requesterLink: "/" + row.Id,
            Approvers: approvers.join(", "),
            Rejected: rejecter // Populate the rejecter field
          };
        });

        this.totalRecords = result.totalRecords;

        // Calculate total pages and update pagination info
        this.totalPages = Math.ceil(result.totalRecords / this.pageSize);
        this.firstRow = (this.currentPage - 1) * this.pageSize + 1;
        this.lastRow = Math.min(
          this.currentPage * this.pageSize,
          this.totalRecords
        );

        // Handle pagination buttons logic
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

  handleFilterAll() {
    this.selectedStatus = ""; // Show all records
    this.currentPage = 1; // Reset to the first page
    this.fetchData();
  }

  handleFilterApproved() {
    this.selectedStatus = "Approved"; // Show only approved records
    this.currentPage = 1;
    this.fetchData();
  }

  handleFilterPending() {
    this.selectedStatus = "Pending"; // Show only pending records
    this.currentPage = 1;
    this.fetchData();
  }

  handleFilterRejected() {
    this.selectedStatus = "Rejected"; // Show only rejected records
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
