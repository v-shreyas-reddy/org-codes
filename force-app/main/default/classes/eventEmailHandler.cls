public class eventEmailHandler {
    public static void sendEventEmail(List<Event> eventList){
        // Collect the IDs of contacts related to the inserted events
        Set<Id> contactIds = new Set<Id>();
        List<Event> newEvents = new List<Event>();
        
        for (Event newEvent : eventList) {
            if (newEvent.WhoId != null && newEvent.WhoId.getSObjectType() == Contact.SObjectType) {
                contactIds.add(newEvent.WhoId);
                newEvents.add(newEvent);
            }
        }
        
        // Query for the related contacts' email addresses
        Map<Id, Contact> contactMap = new Map<Id, Contact>([SELECT Id, Name, Email FROM Contact WHERE Id IN :contactIds]);
        
        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
        
        for (Event newEvent : newEvents) {
            Contact relatedContact = contactMap.get(newEvent.WhoId);
            
            if (relatedContact != null && relatedContact.Email != null) {
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                string[] toAddress = new string[]{relatedContact.Email};
                string emailSub = newEvent.Subject;
                string disName = 'Cloud Org';
                String content = '';
                if(newEvent.Description != null){
                    content = 'Hi '+ relatedContact.Name + ',<br/><br/>' + 
                    newEvent.Description +
                    '<br/><br/>Thank you!';
                }else{
                    content = 'Hi '+ relatedContact.Name + ',<br/><br/>' + 
                    'Your interview is been scheduled' +
                    '<br/><br/>Thank you!';
                }
                
                mail.setSenderDisplayName(disName);
                mail.setToAddresses(toAddress);
                mail.setSubject(emailSub);
                mail.setHtmlBody(content);
                
                emailsToSend.add(mail);
            }
        }
        
        // Send the emails
        if (!emailsToSend.isEmpty()) {
            Messaging.sendEmail(emailsToSend);
        }
    }
}