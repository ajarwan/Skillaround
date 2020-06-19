namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Act_Titles : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Activities", "TitleAr", c => c.String());
            AddColumn("dbo.Activities", "TitleEn", c => c.String());
            DropColumn("dbo.Activities", "Title");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Activities", "Title", c => c.String());
            DropColumn("dbo.Activities", "TitleEn");
            DropColumn("dbo.Activities", "TitleAr");
        }
    }
}
