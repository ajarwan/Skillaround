using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Statistic : EntityBase
    {
        #region"----Properties----"
        public SharedEnums.StatisicType Type { get; set; }

        public int? UserId { get; set; }

        public int? ActivityId { get; set; }
        #endregion

        #region "----NAvigation Properies----"
        public User User { get; set; }
        public Activity Activity { get; set; }
        #endregion
    }
}
