using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Migrations
{
    class Configuration
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            CommandTimeout = 10000;
            //For Autumaatic Migrations To Inherit From EvventaMigrationBase, Comment This To Go Back To Default Generator
            CodeGenerator = new EvventaMigrationCodeGenerator();
        }

        protected override void Seed(WSL.Evventa.Data.EvventaContext context)
        {
            //EvventaSeeder Seeder = new EvventaSeeder(context);
            //Seeder.Run();
        }
    }
}
