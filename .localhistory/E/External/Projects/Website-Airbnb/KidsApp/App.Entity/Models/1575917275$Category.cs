﻿using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Category : EntityBase
    {
        #region "-----Properties-----"
        public string TitleAr { get; set; }
        public string TitleEn { get; set; }

        public bool IsActive { get; set; } = true;
        #endregion

        #region "----Navigation Properties----"
        public ICollection<Activity> Activities { get; set; }

        #endregion
    }
}
