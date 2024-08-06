public with sharing class TechnologyController {
    @AuraEnabled(cacheable=true)
    public static List<Technology__c> getTech() {
        return [SELECT Id, Name, Skill_set__c FROM Technology__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getSkills(Id recordId){
        // Map<String,String> skillsMap = new Map<String,String>();
        List<String> skills = new List<String>();
        Technology__c tech = [SELECT Id, Name, Skill_set__c FROM Technology__c WHERE Id =: recordId LIMIT 1];
        if(tech != null && !string.isBlank(tech.Skill_set__c)){
            skills = tech.Skill_set__c.split(',');
        }
        return skills;
    }
}