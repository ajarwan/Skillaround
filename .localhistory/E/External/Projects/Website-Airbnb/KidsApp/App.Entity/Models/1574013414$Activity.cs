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

        public bool Transportation { get; set; }

        public int UserId { get; set; }
        #endregion


        #region "----Navigation Properties----"
        public User Supplier { get; set; }

        #endregion




    }
}
