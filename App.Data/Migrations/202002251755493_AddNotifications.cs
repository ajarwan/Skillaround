namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNotifications : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Notifications",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ToUserId = c.Int(nullable: false),
                        FromUserId = c.Int(),
                        TextAr = c.String(),
                        TextEn = c.String(),
                        MessagingQueueId = c.Int(),
                        Type = c.Int(nullable: false),
                        UserFriendId = c.Int(),
                        RelatedBookingId = c.Int(),
                        IsSeen = c.Boolean(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.FromUserId)
                .ForeignKey("dbo.MessagingQueues", t => t.MessagingQueueId)
                .ForeignKey("dbo.Bookings", t => t.RelatedBookingId)
                .ForeignKey("dbo.Users", t => t.ToUserId, cascadeDelete: true)
                .ForeignKey("dbo.UserFriends", t => t.UserFriendId)
                .Index(t => t.ToUserId)
                .Index(t => t.FromUserId)
                .Index(t => t.MessagingQueueId)
                .Index(t => t.UserFriendId)
                .Index(t => t.RelatedBookingId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Notifications", "UserFriendId", "dbo.UserFriends");
            DropForeignKey("dbo.Notifications", "ToUserId", "dbo.Users");
            DropForeignKey("dbo.Notifications", "RelatedBookingId", "dbo.Bookings");
            DropForeignKey("dbo.Notifications", "MessagingQueueId", "dbo.MessagingQueues");
            DropForeignKey("dbo.Notifications", "FromUserId", "dbo.Users");
            DropIndex("dbo.Notifications", new[] { "RelatedBookingId" });
            DropIndex("dbo.Notifications", new[] { "UserFriendId" });
            DropIndex("dbo.Notifications", new[] { "MessagingQueueId" });
            DropIndex("dbo.Notifications", new[] { "FromUserId" });
            DropIndex("dbo.Notifications", new[] { "ToUserId" });
            DropTable("dbo.Notifications");
        }
    }
}
