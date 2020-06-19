namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddActivity_At_UserLocation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "AtUserLocation", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "AtUserLocation");
        }
    }
}
