using App.Core.Base;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data
{
    public class AppContext : ContextBase
    {
        public AppContext() : base("name=KidsAppContext")
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityDocument> ActivityDocuments { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<UserFriends> UserFriends { get; set; }

        public DbSet<MessagingQueue> MessagingQueues { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
