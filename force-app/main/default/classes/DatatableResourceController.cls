public with sharing class DatatableResourceController {
  // DataTable query Class with Pagination Support
  @AuraEnabled(Cacheable=true)
  public static Map<String, Object> getResources(
    String searchKey,
    String department,
    String recruiter,
    String status, // Add status filter here
    Integer pageSize,
    Integer pageNumber
  ) {
    String searchPattern = '%' + searchKey + '%';
    String query =
      'SELECT Id, Requester_Name__c, Department__c, Status__c, Location__c, ' +
      'Level_1_Status__c, Level_1_Approver__c, Level_1_Rejecter__c, ' + // Fetch Level 1 Rejecter
      'Level_2_Status__c, Level_2_Approver__c, Level_2_Rejecter__c, ' + // Fetch Level 2 Rejecter
      'Level_3_Status__c, Level_3_Approver__c, Level_3_Rejecter__c ' + // Fetch Level 3 Rejecter
      'FROM Resource__c';

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
    if (String.isNotBlank(status)) {
      whereConditions.add('Status__c = :status'); // Add status filter here
      params.add(status);
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
}
