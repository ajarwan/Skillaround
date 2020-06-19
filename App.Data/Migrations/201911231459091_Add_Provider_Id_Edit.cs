namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Provider_Id_Edit : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "ProviderId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "ProviderId", c => c.Int(nullable: false));
        }
    }
}
