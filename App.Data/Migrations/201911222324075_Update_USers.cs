namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_USers : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "LoginProvider", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "LoginProvider");
        }
    }
}
