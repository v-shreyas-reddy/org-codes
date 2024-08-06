import { LightningElement, track, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import TECHNOLOGIES from '@salesforce/apex/TechnologyController.getTech';

export default class TechSkilInputCmp extends LightningElement {

    @track showTechnicalStack = false;
    @track collectedValues = [];

    showToast(message,title = 'Error', variant = 'error'){
        const toastEvent = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(toastEvent);
    }

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

    @track selectedTechValue = '';
    handleTechChange(event) {
        this.selectedTechValue = event.detail.value;
        // console.log('Picklist Value Id :=> ' + this.selectedTechValue);
        this.showTechnicalStack = this.selectedTechValue;
    }

    @track skills = [{ key: 0, value: '' }];

    handleAddMoreClick() {
        const newKey = this.skills.length;
        this.skills.push({ key: newKey, value: '' });
        // console.log(this.skills);
        // console.log('Length after Addmore:> '+this.skills.length);
    }

    handleDeleteClick(event) {
        if(this.skills.length == 1){
            this.showToast('You cannot delete last Skill.');
            return;
        }
        const index = event.target.dataset.index;
        this.skills.splice(index, 1);
        // console.log(this.skills);
        // console.log('Length after delete:> '+this.skills.length);
    }

    handleSkillChange(event) {
        const index = event.target.dataset.index;
        this.skills[index].value = event.target.value;
        // console.log(this.skills[index].value);
        this.collectedValues = this.skills.map(skill => skill.value);
        console.log(this.collectedValues);
    }

    // get dataValues() {
    //     collectedValues.join(', ')
    // }
}