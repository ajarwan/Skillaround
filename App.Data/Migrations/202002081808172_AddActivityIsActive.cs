namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddActivityIsActive : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "IsActive", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "IsActive");
        }
    }
}
