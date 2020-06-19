namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLongLat : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "Long", c => c.String());
            AddColumn("dbo.Activities", "Lat", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "Lat");
            DropColumn("dbo.Activities", "Long");
        }
    }
}
