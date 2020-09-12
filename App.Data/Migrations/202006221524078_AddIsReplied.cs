namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsReplied : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ContactUsMessages", "IsReplied", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ContactUsMessages", "IsReplied");
        }
    }
}
