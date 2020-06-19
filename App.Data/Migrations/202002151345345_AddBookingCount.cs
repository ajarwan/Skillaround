namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBookingCount : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Bookings", "Count", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Bookings", "Count");
        }
    }
}
