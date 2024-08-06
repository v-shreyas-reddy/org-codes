@isTest
private class AccountControllerTest {
    
    @isTest
    static void testGetAllAccounts() {
        // Create test data
        List<Account> testAccounts = new List<Account>();
        for(Integer i = 0; i < 5; i++) {
            testAccounts.add(new Account(Name = 'Test Account ' + i));
        }
        insert testAccounts;
        
        // Call the method to test
        Test.startTest();
        List<Account> returnedAccounts = AccountController.getAllAccounts();
        Test.stopTest();
        
        // Assertions
        System.assertEquals(5, returnedAccounts.size(), 'Expected 5 accounts');
        // Add more assertions as needed to validate the data
        for(Integer i = 0; i < 5; i++) {
            System.assertEquals('Test Account ' + i, returnedAccounts[i].Name, 'Account Name should match');
        }
    }
}