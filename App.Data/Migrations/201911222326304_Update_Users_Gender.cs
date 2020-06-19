namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Users_Gender : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Gender", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Gender", c => c.Int(nullable: false));
        }
    }
}
