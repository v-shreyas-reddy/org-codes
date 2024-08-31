public with sharing class contactController {
  @AuraEnabled
  public static List<Contact> createContact(Integer numberOfContacts) {
    List<Contact> insertContact = new List<Contact>();
    for (Integer i = 1; i <= numberOfContacts; i++) {
      insertContact.add(new Contact(LastName = 'lwcinsertion' + ' ' + i));
    }
    insert insertContact;
    return [
      SELECT Id, LastName
      FROM Contact
      ORDER BY CreatedDate DESC
      LIMIT :numberOfContacts
    ];
  }

  @AuraEnabled
  public static contact insertContact(contact contactData) {
    try {
      system.debug('Contact Data: ' + contactData);
      insert contactData;
    } catch (Exception e) {
      system.debug(e);
      throw new AuraHandledException(e.getMessage());
    }
    return contactData;
  }
}
