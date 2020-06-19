namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Activity_Price : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "Price", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "Price");
        }
    }
}
