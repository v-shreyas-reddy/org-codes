public with sharing class ResourceController {
  // Record insertion Class
  @AuraEnabled
  public static Resource__c insertResource(Resource__c resourceData) {
    try {
      system.debug('Resource Data: ' + resourceData);
      insert resourceData;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return resourceData;
  }

  // DataTable query Class
  @AuraEnabled(Cacheable=true)
  public static List<Resource__c> getResources(
    String searchKey,
    String department,
    String recruiter,
    Integer limitSize,
    Integer offsetSize
  ) {
    String searchPattern = '%' + searchKey + '%';
    String query = 'SELECT Id, Requester_Name__c, Department__c, Status__c, Location__c FROM Resource__c';
    List<String> whereConditions = new List<String>();
    List<Object> params = new List<Object>();

    if (String.isNotBlank(searchKey)) {
      whereConditions.add(
        '(Requester_Name__c LIKE :searchPattern OR Name LIKE :searchPattern OR Location__c LIKE :searchPattern)'
      );
      params.add(searchPattern);
    }
    if (String.isNotBlank(department)) {
      whereConditions.add('Department__c = :department');
      params.add(department);
    }
    if (String.isNotBlank(recruiter)) {
      whereConditions.add('Recruiter_Name__c LIKE :recruiter');
      params.add('%' + recruiter + '%');
    }

    if (!whereConditions.isEmpty()) {
      query += ' WHERE ' + String.join(whereConditions, ' AND ');
    }

    query += ' LIMIT :limitSize OFFSET :offsetSize';

    return Database.query(query);
  }

  // Department picklist Fetch class
  @AuraEnabled(Cacheable=true)
  public static List<String> getDepartmentPicklistValues() {
    List<String> departmentValues = new List<String>();
    Schema.DescribeFieldResult fieldResult = Resource__c.Department__c.getDescribe();
    List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

    for (Schema.PicklistEntry entry : picklistEntries) {
      departmentValues.add(entry.getLabel());
    }
    return departmentValues;
  }

  //Recruiter values Fetch class
  @AuraEnabled(cacheable=true)
  public static List<String> getRecruiterOptions() {
    // Query distinct Recruiter values from Resource__c object
    List<Resource__c> recruiters = [
      SELECT Recruiter_Name__c
      FROM Resource__c
      WHERE Recruiter_Name__c != NULL
    ];

    // Use a set to eliminate duplicate values
    Set<String> recruiterSet = new Set<String>();
    for (Resource__c record : recruiters) {
      recruiterSet.add(record.Recruiter_Name__c);
    }

    // Convert set to a list and sort it alphabetically
    List<String> recruiterList = new List<String>(recruiterSet);
    recruiterList.sort();

    return recruiterList;
  }
}
