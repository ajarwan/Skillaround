using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Booking : EntityBase
    {

        #region "----Properties----"
        public int UserId { get; set; }
         
        public int ActivityId { get; set; }

        public SharedEnums
        #endregion

        #region "----Navigation Properties----"
        public User User { get; set; }

        public Activity Activity { get; set; }
        #endregion

    }
}
