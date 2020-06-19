namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class WorkingDays : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.WorkingDays",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        Day = c.Int(nullable: false),
                        Start = c.Time(nullable: false, precision: 7),
                        End = c.Time(nullable: false, precision: 7),
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
            
            DropColumn("dbo.Users", "SupplierStatrtWorkingDay");
            DropColumn("dbo.Users", "SupplierEndWorkingDay");
            DropColumn("dbo.Users", "StartWorkingTime");
            DropColumn("dbo.Users", "EndWorkingTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "EndWorkingTime", c => c.Time(precision: 7));
            AddColumn("dbo.Users", "StartWorkingTime", c => c.Time(precision: 7));
            AddColumn("dbo.Users", "SupplierEndWorkingDay", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "SupplierStatrtWorkingDay", c => c.Int(nullable: false));
            DropForeignKey("dbo.WorkingDays", "UserId", "dbo.Users");
            DropIndex("dbo.WorkingDays", new[] { "UserId" });
            DropTable("dbo.WorkingDays");
        }
    }
}
