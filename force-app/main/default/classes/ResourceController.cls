public with sharing class ResourceController {
  // DataTable query Class with Pagination Support
  @AuraEnabled(Cacheable=true)
  public static Map<String, Object> getResources(
    String searchKey,
    String department,
    String recruiter,
    Integer pageSize,
    Integer pageNumber
  ) {
    String searchPattern = '%' + searchKey + '%';
    String query = 'SELECT Id, Requester_Name__c, Department__c, Status__c, Location__c FROM Resource__c';
    List<String> whereConditions = new List<String>();
    List<Object> params = new List<Object>();

    // Add conditions dynamically based on provided input fields
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

    // If there are any conditions, append them to the query
    if (!whereConditions.isEmpty()) {
      query += ' WHERE ' + String.join(whereConditions, ' AND ');
    }

    // Total record count query
    String countQuery = 'SELECT COUNT() FROM Resource__c';
    if (!whereConditions.isEmpty()) {
      countQuery += ' WHERE ' + String.join(whereConditions, ' AND ');
    }

    // Execute count query
    Integer totalRecords = Database.countQuery(countQuery);

    // Add pagination (OFFSET & LIMIT)
    Integer offsetValue = (pageNumber - 1) * pageSize;
    query += ' LIMIT :pageSize OFFSET :offsetValue';

    // Execute the dynamic SOQL query and return results
    List<Resource__c> resources = Database.query(query);

    // Prepare the result to include both the data and total record count
    Map<String, Object> result = new Map<String, Object>();
    result.put('resources', resources);
    result.put('totalRecords', totalRecords);

    return result;
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
}
