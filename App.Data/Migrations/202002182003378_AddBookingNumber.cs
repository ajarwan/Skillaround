namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBookingNumber : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Bookings", "BookingNumber", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Bookings", "BookingNumber");
        }
    }
}
