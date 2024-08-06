public with sharing class ApprovalProcessController {
    @AuraEnabled
    public static String submitForApproval(String recordId) {
        // Perform validation or additional logic if needed

        // Create a new ProcessSubmitRequest and set the appropriate parameters
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting record for approval.');
        req.setObjectId(recordId);

        // Submit the record for approval
        Approval.ProcessResult result = Approval.process(req);

        // Handle the approval process result
        if (result.isSuccess()) {
            return result.getInstanceId();
        } else {
            System.debug('Failed to submit record for approval: ' + result.getErrors()[0].getMessage());
            throw new AuraHandledException('Failed to submit record for approval.');
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ApproverInfo> getUsersInApprovalProcess(Id recordId) {
        List<ApproverInfo> approvers = new List<ApproverInfo>();
        
        // Query ProcessInstance and ProcessInstanceStep
        List<ProcessInstance> processInstances = [SELECT Id, TargetObjectId
                                                  FROM ProcessInstance
                                                  WHERE TargetObjectId = :recordId];
        for (ProcessInstance processInstance : processInstances) {
            List<ProcessInstanceStep> steps = [SELECT Id, StepStatus, ProcessInstanceId, ActorId
                                               FROM ProcessInstanceStep
                                               WHERE ProcessInstanceId = :processInstance.Id];
            for (ProcessInstanceStep step : steps) {
                // Retrieve approver information
                User approver = [SELECT Id, Name
                                 FROM User
                                 WHERE Id = :step.ActorId
                                 LIMIT 1];
                approvers.add(new ApproverInfo(approver.Name));
            }
        }
        
        return approvers;
    }
    
    public class ApproverInfo {
        @AuraEnabled
        public String name;
        
        public ApproverInfo(String name) {
            this.name = name;
        }
    }
}