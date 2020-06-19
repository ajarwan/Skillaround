namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Rename_Lng : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "Lng", c => c.String());
            DropColumn("dbo.Activities", "Long");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Activities", "Long", c => c.String());
            DropColumn("dbo.Activities", "Lng");
        }
    }
}
