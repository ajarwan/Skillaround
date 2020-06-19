namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Dcuments_MetaData : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserDocuments", "FileName", c => c.String());
            AddColumn("dbo.UserDocuments", "FileSize", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserDocuments", "FileSize");
            DropColumn("dbo.UserDocuments", "FileName");
        }
    }
}
