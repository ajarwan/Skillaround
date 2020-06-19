namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateUserEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "LastActiveDate", c => c.DateTime());
            DropColumn("dbo.Users", "IsOnline");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "IsOnline", c => c.Boolean(nullable: false));
            DropColumn("dbo.Users", "LastActiveDate");
        }
    }
}
