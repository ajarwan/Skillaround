namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeOnBookingEntity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Bookings", "Status", c => c.Int(nullable: false));
            AddColumn("dbo.Bookings", "LastApprovalDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Bookings", "LastApprovalDate");
            DropColumn("dbo.Bookings", "Status");
        }
    }
}
