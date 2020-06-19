namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOnLineLocation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "OnlineLocation", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "OnlineLocation");
        }
    }
}
