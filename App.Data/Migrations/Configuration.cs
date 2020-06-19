using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Migrations
{
    class Configuration : DbMigrationsConfiguration<AppContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            CommandTimeout = 10000;

        }
        protected override void Seed(AppContext context)
        {
            //EvventaSeeder Seeder = new EvventaSeeder(context);
            //Seeder.Run();
        }
    }
}
