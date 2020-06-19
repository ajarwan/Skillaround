namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Act_Descriptions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "DescriptionAr", c => c.String());
            AddColumn("dbo.Activities", "DescriptionEn", c => c.String());
            DropColumn("dbo.Activities", "Description");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Activities", "Description", c => c.String());
            DropColumn("dbo.Activities", "DescriptionEn");
            DropColumn("dbo.Activities", "DescriptionAr");
        }
    }
}
