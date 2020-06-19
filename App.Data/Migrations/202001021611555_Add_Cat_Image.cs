namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Cat_Image : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Categories", "ImageName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Categories", "ImageName");
        }
    }
}
