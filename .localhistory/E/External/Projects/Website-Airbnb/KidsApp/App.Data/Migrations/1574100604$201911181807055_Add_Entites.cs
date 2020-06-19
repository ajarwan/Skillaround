namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Entites : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Activities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(),
                        LocationName = c.String(),
                        LocationId = c.String(),
                        AgeFrom = c.Int(nullable: false),
                        AgeTo = c.Int(nullable: false),
                        From = c.DateTime(),
                        To = c.DateTime(),
                        Transportation = c.Boolean(nullable: false),
                        IsPosted = c.Boolean(nullable: false),
                        SupplierId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.SupplierId, cascadeDelete: true)
                .Index(t => t.SupplierId);
            
            CreateTable(
                "dbo.Bookings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ActivityId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Activities", t => t.ActivityId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ActivityId);
            
            CreateTable(
                "dbo.UserDocuments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DocumentType = c.Int(nullable: false),
                        File = c.String(),
                        UserId = c.Int(nullable: false),
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
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Reviews",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        Rate = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        ActivityId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Activities", t => t.ActivityId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ActivityId);
            
            CreateTable(
                "dbo.ActivityDocuments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        File = c.String(),
                        IsMain = c.Boolean(nullable: false),
                        ActivityId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        UpdateDate = c.DateTime(),
                        DeleteDate = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        CreatedBy = c.Int(nullable: false),
                        UpdatedBy = c.Int(),
                        DeletedBy = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Activities", t => t.ActivityId, cascadeDelete: true)
                .Index(t => t.ActivityId);
            
            AddColumn("dbo.Users", "IsSupplier", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "PhoneNumber", c => c.String());
            AddColumn("dbo.Users", "PlaceLocationId", c => c.String());
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ActivityDocuments", "ActivityId", "dbo.Activities");
            DropForeignKey("dbo.Reviews", "UserId", "dbo.Users");
            DropForeignKey("dbo.Reviews", "ActivityId", "dbo.Activities");
            DropForeignKey("dbo.UserDocuments", "UserId", "dbo.Users");
            DropForeignKey("dbo.Bookings", "UserId", "dbo.Users");
            DropForeignKey("dbo.Activities", "SupplierId", "dbo.Users");
            DropForeignKey("dbo.Bookings", "ActivityId", "dbo.Activities");
            DropIndex("dbo.ActivityDocuments", new[] { "ActivityId" });
            DropIndex("dbo.Reviews", new[] { "ActivityId" });
            DropIndex("dbo.Reviews", new[] { "UserId" });
            DropIndex("dbo.UserDocuments", new[] { "UserId" });
            DropIndex("dbo.Bookings", new[] { "ActivityId" });
            DropIndex("dbo.Bookings", new[] { "UserId" });
            DropIndex("dbo.Activities", new[] { "SupplierId" });
            DropColumn("dbo.Users", "PlaceLocationId");
            DropColumn("dbo.Users", "PhoneNumber");
            DropColumn("dbo.Users", "IsSupplier");
            DropTable("dbo.ActivityDocuments");
            DropTable("dbo.Reviews");
            DropTable("dbo.UserDocuments");
            DropTable("dbo.Bookings");
            DropTable("dbo.Activities");
        }
    }
}
