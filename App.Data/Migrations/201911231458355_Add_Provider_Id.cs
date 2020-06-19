namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Provider_Id : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ProviderId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "ProviderId");
        }
    }
}
