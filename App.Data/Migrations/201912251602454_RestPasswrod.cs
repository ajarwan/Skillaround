namespace App.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RestPasswrod : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "UserUniqueId", c => c.Guid());
            AddColumn("dbo.Users", "PasswordStatus", c => c.Int(nullable: false, defaultValue: 1));
        }

        public override void Down()
        {
            DropColumn("dbo.Users", "PasswordStatus");
            DropColumn("dbo.Users", "UserUniqueId");
        }
    }
}
