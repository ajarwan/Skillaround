namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_IsAccountActivated : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsAccountActivated", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "IsAccountActivated");
        }
    }
}
