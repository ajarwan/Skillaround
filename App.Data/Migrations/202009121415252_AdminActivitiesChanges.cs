namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AdminActivitiesChanges : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Activities", "SupplierId", "dbo.Users");
            DropIndex("dbo.Activities", new[] { "SupplierId" });
            AddColumn("dbo.Activities", "SupplierName", c => c.String());
            AddColumn("dbo.Activities", "SupplierEmail", c => c.String());
            AddColumn("dbo.Activities", "SupplierPhoneNumber", c => c.String());
            AlterColumn("dbo.Activities", "SupplierId", c => c.Int());
            CreateIndex("dbo.Activities", "SupplierId");
            AddForeignKey("dbo.Activities", "SupplierId", "dbo.Users", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Activities", "SupplierId", "dbo.Users");
            DropIndex("dbo.Activities", new[] { "SupplierId" });
            AlterColumn("dbo.Activities", "SupplierId", c => c.Int(nullable: false));
            DropColumn("dbo.Activities", "SupplierPhoneNumber");
            DropColumn("dbo.Activities", "SupplierEmail");
            DropColumn("dbo.Activities", "SupplierName");
            CreateIndex("dbo.Activities", "SupplierId");
            AddForeignKey("dbo.Activities", "SupplierId", "dbo.Users", "Id", cascadeDelete: true);
        }
    }
}
