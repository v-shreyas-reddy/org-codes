@isTest
private class OpportunityControllerTest {

    @isTest
    static void testGetAllOpps() {
        // Create test data
        List<Opportunity> testOpps = new List<Opportunity>();
        for(Integer i = 0; i < 5; i++) {
            Opportunity opp = new Opportunity(
                Name = 'Test Opp ' + i,
                StageName = 'Prospecting', // Adding StageName
                CloseDate = Date.today().addDays(30) // Adding CloseDate 30 days from today
            );
            testOpps.add(opp);
        }
        insert testOpps;

        Test.startTest();
        // Call the method to be tested
        List<Opportunity> resultOpps = OpportunityController.getAllOpps();
        Test.stopTest();

        // Assertions
        System.assertEquals(5, resultOpps.size(), 'Number of opportunities should be 5');

        // Add more specific assertions if needed
        for(Integer i = 0; i < 5; i++) {
            System.assertEquals('Test Opp ' + i, resultOpps[i].Name, 'Name should match');
        }
    }
}