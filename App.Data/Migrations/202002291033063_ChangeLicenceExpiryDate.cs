namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeLicenceExpiryDate : DbMigration
    {
        public override void Up()
        {
            RenameColumn("dbo.Users", "LicenseIssueDate", "LicenseExpiryDate");
            
        }
        
        public override void Down()
        {
            RenameColumn("dbo.Users", "LicenseExpiryDate", "LicenseIssueDate");
        }
    }
}
