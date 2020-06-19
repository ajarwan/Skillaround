namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSupplierVerified : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsSupplierVerified", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "IsSupplierVerified");
        }
    }
}
