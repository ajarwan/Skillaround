namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Supplier_WorkingDays : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "SupplierStatrtWorkingDay", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "SupplierEndWorkingDay", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "StartWorkingTime", c => c.Time(precision: 7));
            AddColumn("dbo.Users", "EndWorkingTime", c => c.Time(precision: 7));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "EndWorkingTime");
            DropColumn("dbo.Users", "StartWorkingTime");
            DropColumn("dbo.Users", "SupplierEndWorkingDay");
            DropColumn("dbo.Users", "SupplierStatrtWorkingDay");
        }
    }
}
