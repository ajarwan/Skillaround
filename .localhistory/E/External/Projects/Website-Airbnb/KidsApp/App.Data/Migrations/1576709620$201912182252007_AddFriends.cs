namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFriends : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserFriends",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        FriendId = c.Int(nullable: false),
                        AcceptStatus = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.FriendId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.FriendId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserFriends", "FriendId", "dbo.Users");
            DropForeignKey("dbo.UserFriends", "UserId", "dbo.Users");
            DropIndex("dbo.UserFriends", new[] { "FriendId" });
            DropIndex("dbo.UserFriends", new[] { "UserId" });
            DropTable("dbo.UserFriends");
        }
    }
}
