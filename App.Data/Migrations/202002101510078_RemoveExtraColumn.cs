namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveExtraColumn : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Users", "IsAccountActivated");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "IsAccountActivated", c => c.Boolean(nullable: false));
        }
    }
}
