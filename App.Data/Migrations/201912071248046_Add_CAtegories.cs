namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_CAtegories : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TitleAr = c.String(),
                        TitleEn = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Activities", "CategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.Activities", "CategoryId");
            AddForeignKey("dbo.Activities", "CategoryId", "dbo.Categories", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Activities", "CategoryId", "dbo.Categories");
            DropIndex("dbo.Activities", new[] { "CategoryId" });
            DropColumn("dbo.Activities", "CategoryId");
            DropTable("dbo.Categories");
        }
    }
}
