public with sharing class PicklistController {
  @AuraEnabled(cacheable=true)
  public static Map<String, List<PicklistValueWrapper>> getMultiplePicklistValues(
    String objectName,
    List<String> fieldNames
  ) {
    Map<String, List<PicklistValueWrapper>> picklistValuesMap = new Map<String, List<PicklistValueWrapper>>();

    if (
      String.isBlank(objectName) ||
      fieldNames == null ||
      fieldNames.isEmpty()
    ) {
      return picklistValuesMap;
    }

    Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
    if (objType != null) {
      Schema.DescribeSObjectResult objDescribe = objType.getDescribe();

      for (String fieldName : fieldNames) {
        // Check if the field exists in the object's fields map
        if (objDescribe.fields.getMap().containsKey(fieldName)) {
          Schema.DescribeFieldResult fieldDescribe = objDescribe.fields.getMap()
            .get(fieldName)
            .getDescribe();
          List<Schema.PicklistEntry> picklistEntries = fieldDescribe.getPicklistValues();

          if (picklistEntries != null && !picklistEntries.isEmpty()) {
            List<PicklistValueWrapper> picklistValues = new List<PicklistValueWrapper>();
            for (Schema.PicklistEntry entry : picklistEntries) {
              picklistValues.add(
                new PicklistValueWrapper(entry.getLabel(), entry.getValue())
              );
            }

            picklistValuesMap.put(fieldName, picklistValues);
          }
        } else {
          // If the field does not exist, initialize an empty list for it in the map
          picklistValuesMap.put(fieldName, new List<PicklistValueWrapper>());
        }
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