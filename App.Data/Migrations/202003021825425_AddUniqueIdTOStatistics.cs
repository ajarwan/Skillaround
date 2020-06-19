namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUniqueIdTOStatistics : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Statistics", "UniqueId", c => c.Guid(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Statistics", "UniqueId");
        }
    }
}
