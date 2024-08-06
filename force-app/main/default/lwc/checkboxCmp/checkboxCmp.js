import { LightningElement,track,api } from 'lwc';

const salesforceStackOptions = [
    { label: 'Sales Cloud', value: 'Sales Cloud', },
    { label: 'Experience Cloud', value: 'Experience Cloud' },
    { label: 'Service Cloud', value: 'Service Cloud' },
    { label: 'App Cloud', value: 'App Cloud' },
    { label: 'Community Cloud', value: 'Community Cloud' },
    { label: 'LWC', value: 'LWC' },
    { label: 'Apex', value: 'Apex' },
    { label: 'Aura', value: 'Aura' }
];
const oracleStackOptions = [
    { label: 'Java', value: 'Java' },
    { label: 'ERP', value: 'ERP' },
    { label: 'SQL', value: 'SQL' },
    { label: 'MYSQL', value: 'MYSQL' },
];
const sapStackOptions = [
    { label: 'SAP', value: 'SAP' },
    { label: 'HANA', value: 'HANA' },
    { label: 'ABAP', value: 'ABAP' },
    { label: 'Blockchain', value: 'Blockchain' },
];

export default class CheckboxCmp extends LightningElement {
    @track technologyOptions = [
        { label: 'SAP', value: 'SAP' },
        { label: 'Oracle', value: 'Oracle' },
        { label: 'Salesforce', value: 'Salesforce' }
    ];

    @track technicalStackOptions = [];

    @track showTechnicalStack = false;
    @api selectedTechnicalStack = [];

    handleTechnologyChange(event) {
        const selectedTech = event.detail.value;

        // Set options for technical stack based on selected technology
        if (selectedTech === 'Salesforce') {
            this.technicalStackOptions = salesforceStackOptions;
        } else if (selectedTech === 'Oracle') {
            this.technicalStackOptions = oracleStackOptions;
        } else if (selectedTech === 'SAP') {
            this.technicalStackOptions = sapStackOptions;
        } else {
            this.technicalStackOptions = [];
        }

        this.showTechnicalStack = this.technicalStackOptions.length > 0;
        this.selectedTechnicalStack = [];
    }

    handleTechnicalStackChange(event) {
        this.selectedTechnicalStack = event.detail.value;
        console.log(JSON.stringify(this.selectedTechnicalStack));
    }

    selectAll(event) {
        this.selectedTechnicalStack = [...this.technicalStackOptions.map(option => option.value)];
        console.log(JSON.stringify(this.selectedTechnicalStack));
    }

    clearAll() {
        this.selectedTechnicalStack = [];
        console.log(JSON.stringify(this.selectedTechnicalStack));
    }

    handlePillRemove(event) {
        const pillIndex = event.detail.index ? event.detail.index : event.detail.name;
        //console.log("Pill Index;=>" +pillIndex);
        const itempill = this.selectedTechnicalStack;
        itempill.splice(pillIndex, 1);       
        this.selectedTechnicalStack = [...itempill];
        console.log(JSON.stringify(this.selectedTechnicalStack));
    }

    // get selectedValues() {
    //     return this.selectedTechnicalStack.join(';');
    // }
}