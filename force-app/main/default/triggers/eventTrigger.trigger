trigger eventTrigger on Event (before insert, after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        eventEmailHandler.sendEventEmail(Trigger.new);
    }
}