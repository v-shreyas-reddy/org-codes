public with sharing class ResourceController {
    @AuraEnabled
    public static Resource__c insertResource(Resource__c resourceData){
        try {
            system.debug('Resource Data: '+resourceData);
            insert resourceData; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return resourceData;
    }
}