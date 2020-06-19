using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Booking
    {

        #region "----Properties----"
        public int UserId { get; set; }

        public int ActivityId { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public User User { get; set; }

        public Activity User { get; set; }
        #endregion

    }
}
