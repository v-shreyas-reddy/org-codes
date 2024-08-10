public with sharing class PicklistController {
  @AuraEnabled(cacheable=true)
  public static Map<String, List<PicklistValueWrapper>> getMultiplePicklistValues(
    String objectName,
    List<String> fieldNames
  ) {
    Map<String, List<PicklistValueWrapper>> picklistValuesMap = new Map<String, List<PicklistValueWrapper>>();

    Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
    if (objType != null) {
      Schema.DescribeSObjectResult objDescribe = objType.getDescribe();

      for (String fieldName : fieldNames) {
        Schema.DescribeFieldResult fieldDescribe = objDescribe.fields.getMap()
          .get(fieldName)
          .getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldDescribe.getPicklistValues();

        List<PicklistValueWrapper> picklistValues = new List<PicklistValueWrapper>();
        for (Schema.PicklistEntry entry : picklistEntries) {
          picklistValues.add(
            new PicklistValueWrapper(entry.getLabel(), entry.getValue())
          );
        }

        picklistValuesMap.put(fieldName, picklistValues);
      }
    }

    return picklistValuesMap;
  }

  public class PicklistValueWrapper {
    @AuraEnabled
    public String Label { get; set; }
    @AuraEnabled
    public String Value { get; set; }

    public PicklistValueWrapper(String label, String value) {
      this.Label = label;
      this.Value = value;
    }
  }
}
