namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Change_Data_Typ : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Activities", "Lng", c => c.Decimal(nullable: false, precision: 18, scale: 15));
            AlterColumn("dbo.Activities", "Lat", c => c.Decimal(nullable: false, precision: 18, scale: 15));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Activities", "Lat", c => c.String());
            AlterColumn("dbo.Activities", "Lng", c => c.String());
        }
    }
}
