using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class ActivityDocument : EntityBase
    {
        #region "----Properties----"
        public string File { get; set; }

        public int ActivityId { get; set; }
        #region

        #region "----Navigation Properties----"
        public Activity Activity { get; set; }
        #endregion

    }
}
