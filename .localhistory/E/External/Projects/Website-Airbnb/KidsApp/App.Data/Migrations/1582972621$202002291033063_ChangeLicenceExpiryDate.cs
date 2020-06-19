namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeLicenceExpiryDate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "LicenseExpiryDate", c => c.DateTime());
            DropColumn("dbo.Users", "LicenseIssueDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "LicenseIssueDate", c => c.DateTime());
            DropColumn("dbo.Users", "LicenseExpiryDate");
        }
    }
}
