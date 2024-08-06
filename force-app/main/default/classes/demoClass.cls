public class demoClass {
    public static List<UserRole> getRolesReportingToCTO() {
        List<UserRole> rolesReportingToCTO = new List<UserRole>();
        
        // Query to find the CTO role ID
        UserRole ctoRole = [SELECT Id FROM UserRole WHERE DeveloperName = 'CTO' LIMIT 1];
        System.debug('CTO Role: ' + ctoRole);
        
        // If CTO role found, query for roles reporting to CTO
        if (ctoRole != null) {
            rolesReportingToCTO = [SELECT Id, Name, DeveloperName 
                                   FROM UserRole 
                                   WHERE ParentRoleId = :ctoRole.Id];
            System.debug('Roles reporting to CTO: ' + rolesReportingToCTO);
        } else {
            System.debug('CTO role not found');
        }
        
        return rolesReportingToCTO;
    }
}