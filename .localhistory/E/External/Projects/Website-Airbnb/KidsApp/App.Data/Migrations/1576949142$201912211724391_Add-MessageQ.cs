namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddMessageQ : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.MessagingQueues",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FromUserId = c.Int(nullable: false),
                        ToUserId = c.Int(nullable: false),
                        Message = c.String(),
                        MessageType = c.Int(nullable: false),
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
                .ForeignKey("dbo.Users", t => t.FromUserId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.ToUserId, cascadeDelete: true)
                .Index(t => t.FromUserId)
                .Index(t => t.ToUserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.MessagingQueues", "ToUserId", "dbo.Users");
            DropForeignKey("dbo.MessagingQueues", "FromUserId", "dbo.Users");
            DropIndex("dbo.MessagingQueues", new[] { "ToUserId" });
            DropIndex("dbo.MessagingQueues", new[] { "FromUserId" });
            DropTable("dbo.MessagingQueues");
        }
    }
}
