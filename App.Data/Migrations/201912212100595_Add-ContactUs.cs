namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddContactUs : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ContactUsMessages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FromUserId = c.Int(),
                        Messgae = c.String(),
                        Email = c.String(),
                        Name = c.String(),
                        MobileNumber = c.String(),
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
                .Index(t => t.FromUserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ContactUsMessages", "FromUserId", "dbo.Users");
            DropIndex("dbo.ContactUsMessages", new[] { "FromUserId" });
            DropTable("dbo.ContactUsMessages");
        }
    }
}
