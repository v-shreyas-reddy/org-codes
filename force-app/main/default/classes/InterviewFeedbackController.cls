public with sharing class InterviewFeedbackController {
    @AuraEnabled
    public static Interview_Feedback__c insertFeedback(Interview_Feedback__c feedbackData){
        try {
            System.debug('Feedback Data:=> '+feedbackData);
            insert feedbackData;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return feedbackData;
    }
}