namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_Icon_Class : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Categories", "IconClass", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Categories", "IconClass");
        }
    }
}
