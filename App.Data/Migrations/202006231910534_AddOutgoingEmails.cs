namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOutgoingEmails : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OutgoingEmails",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TextAr = c.String(),
                        TextEn = c.String(),
                        Subject = c.String(),
                        MailReceiverType = c.Int(nullable: false),
                        IsProcessing = c.Boolean(nullable: false),
                        IsSuccess = c.Boolean(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.OutgoingEmails");
        }
    }
}
