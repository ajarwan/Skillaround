namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Capacity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "Capacity", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Activities", "Capacity");
        }
    }
}
