import { LightningElement, wire, track, api } from 'lwc';
import TECHNOLOGIES from '@salesforce/apex/TechnologyController.getTech';
import SKILLSSET from '@salesforce/apex/TechnologyController.getSkills';

export default class DynamicCheckboxCmp extends LightningElement {

    @track showTechnicalStack = false;

    //logic for technology picklist values
    techOptions = [];
    @wire(TECHNOLOGIES)
    wiredTechs({ error, data }) {
        if (data) {
            this.techOptions = data.map(technology => {
                return {
                    label: technology.Name,
                    value: technology.Id
                };
            });
        } else if (error) {
            console.log("Error: " + JSON.stringify(error));
        }
    }

    // function for onchange on technology picklist
    @track selectedTechValue = '';
    handleTechChange(event) {
        this.selectedTechValue = event.detail.value;
        this.technologyId = event.detail.value;
        console.log('Picklist Value Id :=> ' + this.selectedTechValue);
        this.showTechnicalStack = this.selectedTechValue;
    }

    technologyId;
    result;
    @wire(SKILLSSET, { recordId: '$technologyId' })
    wiredSkillSet({ error, data }) {
        if (data) {
            this.result = data.map(skills => {
                return {
                    label: skills,
                    value: skills
                }
            });
            //console.log(JSON.stringify(data));
        } else if (error) {
            console.log(error);
        }
    }

    @api selectedSkillValue = [];
    handleTechnicalStackChange(event) {
        this.selectedSkillValue = event.detail.value;
        console.log(this.selectedSkillValue);
    }

    handlePillRemove(event) {
        const pillIndex = event.detail.index ? event.detail.index : event.detail.name;
        //console.log("Pill Index;=>" +pillIndex);
        const itempill = this.selectedSkillValue;
        itempill.splice(pillIndex, 1);
        this.selectedSkillValue = [...itempill];
        console.log('Click From Lightning Pill :=> '+JSON.stringify(this.selectedSkillValue));
    }

    selectAll() {
        this.selectedSkillValue = [...this.result.map(option => option.value)];
        console.log('Select All :=> ' + JSON.stringify(this.selectedSkillValue));
    }

    clearAll() {
        this.selectedSkillValue = [];
        console.log('Clear All :=> ' + JSON.stringify(this.selectedSkillValue));
    }

}