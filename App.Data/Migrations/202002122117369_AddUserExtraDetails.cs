namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserExtraDetails : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "YearOfEstablishment", c => c.DateTime());
            AddColumn("dbo.Users", "LicenseIssueDate", c => c.DateTime());
            AddColumn("dbo.Users", "Location", c => c.String());
            AddColumn("dbo.Users", "LicenseNumber", c => c.String());
            AddColumn("dbo.Users", "IdNumber", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "IdNumber");
            DropColumn("dbo.Users", "LicenseNumber");
            DropColumn("dbo.Users", "Location");
            DropColumn("dbo.Users", "LicenseIssueDate");
            DropColumn("dbo.Users", "YearOfEstablishment");
        }
    }
}
