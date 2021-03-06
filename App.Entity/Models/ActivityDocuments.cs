﻿using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class ActivityDocument : EntityBase
    {
        #region "----Properties----"
        public string File { get; set; }

        public bool IsMain { get; set; }

        public int ActivityId { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public Activity Activity { get; set; }

        [InverseProperty("Thumbnail")]
        public ICollection<Activity> ActivityThumbnails { get; set; }
        #endregion

    }
}
