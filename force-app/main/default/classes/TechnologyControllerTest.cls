@isTest
private class TechnologyControllerTest {
    
    @isTest
    static void testGetTech() {
        // Test data setup
        List<Technology__c> techList = new List<Technology__c>();
        techList.add(new Technology__c(Name = 'Tech 1', Skill_set__c = 'Java,Python'));
        techList.add(new Technology__c(Name = 'Tech 2', Skill_set__c = 'JavaScript,HTML,CSS'));
        
        insert techList;
        
        Test.startTest();
        List<Technology__c> result = TechnologyController.getTech();
        Test.stopTest();
        
        System.assertEquals(2, result.size(), 'Incorrect number of records fetched');
        // Add more assertions as needed to validate the returned data
    }
    
    @isTest
    static void testGetSkills() {
        // Test data setup
        Technology__c tech = new Technology__c(Name = 'Test Tech', Skill_set__c = 'Apex,SOQL,Salesforce');
        insert tech;
        
        Test.startTest();
        List<String> skills = TechnologyController.getSkills(tech.Id);
        Test.stopTest();
        
        System.assertEquals(3, skills.size(), 'Incorrect number of skills fetched');
        // Add more assertions as needed to validate the returned skills
    }
}