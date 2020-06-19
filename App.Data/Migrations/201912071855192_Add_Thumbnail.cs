namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Thumbnail : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "ThumbnailId", c => c.Int());
            CreateIndex("dbo.Activities", "ThumbnailId");
            AddForeignKey("dbo.Activities", "ThumbnailId", "dbo.ActivityDocuments", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Activities", "ThumbnailId", "dbo.ActivityDocuments");
            DropIndex("dbo.Activities", new[] { "ThumbnailId" });
            DropColumn("dbo.Activities", "ThumbnailId");
        }
    }
}
