using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Activity : EntityBase
    {

        #region "----Properties----"
        public string Title { get; set; }

        public string Description { get; set; }

        public string LocationName { get; set; }

        public string LocationId { get; set; }

        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }

        public DateTime? From { get; set; }

        public DateTime? To { get; set; }

        public bool Transportation { get; set; }
        public bool IsPosted { get; set; }

        public int SupplierId { get; set; }
        public int CategoryId { get; set; }

        #endregion


        #region "----Navigation Properties----"
        public User Supplier { get; set; }

        public Category Category { get; set; }

        public ICollection<ActivityDocument> Documents { get; set; }

        public ICollection<Review> Reviews { get; set; }

        public ICollection<Booking> Bookings { get; set; }

        
        #endregion




    }
}
