@isTest
public class PicklistControllerTest {
    @isTest
    static void testGetMultiplePicklistValuesValid() {
        // Arrange
        String objectName = 'Account';
        List<String> fieldNames = new List<String>{'Industry', 'Type'};

        // Act
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);

        // Assert
        System.assert(result != null, 'Result should not be null');
        System.assert(result.containsKey('Industry'), 'Result should contain Industry key');
        System.assert(result.containsKey('Type'), 'Result should contain Type key');
        
        // Check if the values for Industry and Type are not null and contain values
        System.assert(result.get('Industry').size() > 0, 'Industry picklist values should not be empty');
        System.assert(result.get('Type').size() > 0, 'Type picklist values should not be empty');
    }

    @isTest
    static void testGetMultiplePicklistValuesInvalidObject() {
        // Arrange
        String objectName = 'InvalidObject';
        List<String> fieldNames = new List<String>{'Industry'};

        // Act
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);

        // Assert
        System.assert(result != null, 'Result should not be null');
        System.assertEquals(result.size(), 0, 'Result should be empty for an invalid object');
    }

    @isTest
    static void testGetMultiplePicklistValuesInvalidField() {
        // Arrange
        String objectName = 'Account';
        List<String> fieldNames = new List<String>{'InvalidField'};

        // Act
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);

        // Assert
        System.assert(result != null, 'Result should not be null');
        System.assert(result.containsKey('InvalidField'), 'Result should contain InvalidField key');
        System.assertEquals(result.get('InvalidField').size(), 0, 'InvalidField picklist values should be empty');
    }

    @isTest
    static void testGetMultiplePicklistValuesEmptyFieldNames() {
        // Arrange
        String objectName = 'Account';
        List<String> fieldNames = new List<String>();

        // Act
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);

        // Assert
        System.assert(result != null, 'Result should not be null');
        System.assertEquals(result.size(), 0, 'Result should be empty when field names list is empty');
    }
    
    @isTest
    static void testGetMultiplePicklistValuesNullObjectName() {
        // Arrange
        String objectName = null;
        List<String> fieldNames = new List<String>{'Industry'};

        // Act
        Test.startTest();
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);
        Test.stopTest();

        // Assert
        System.assertEquals(result.size(), 0, 'Result should be empty when object name is null');
    }

    @isTest
    static void testGetMultiplePicklistValuesNullFieldNames() {
        // Arrange
        String objectName = 'Account';
        List<String> fieldNames = null;

        // Act
        Test.startTest();
        Map<String, List<PicklistController.PicklistValueWrapper>> result = PicklistController.getMultiplePicklistValues(objectName, fieldNames);
        Test.stopTest();

        // Assert
        System.assertEquals(result.size(), 0, 'Result should be empty when field names list is null');
    }
}