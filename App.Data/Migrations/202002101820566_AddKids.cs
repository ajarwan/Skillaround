namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddKids : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Kids",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        KidName = c.String(),
                        Gender = c.Int(nullable: false),
                        DOB = c.DateTime(),
                        ParentId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.ParentId, cascadeDelete: true)
                .Index(t => t.ParentId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Kids", "ParentId", "dbo.Users");
            DropIndex("dbo.Kids", new[] { "ParentId" });
            DropTable("dbo.Kids");
        }
    }
}
