namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddContactUsReply : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ContactUsMessageReplies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ContactUsMessageId = c.Int(nullable: false),
                        Text = c.String(),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ContactUsMessages", t => t.ContactUsMessageId, cascadeDelete: true)
                .Index(t => t.ContactUsMessageId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactUsMessageReplies", "ContactUsMessageId", "dbo.ContactUsMessages");
            DropIndex("dbo.ContactUsMessageReplies", new[] { "ContactUsMessageId" });
            DropTable("dbo.ContactUsMessageReplies");
        }
    }
}
