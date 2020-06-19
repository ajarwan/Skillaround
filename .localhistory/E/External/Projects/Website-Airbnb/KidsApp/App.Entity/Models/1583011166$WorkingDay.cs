using App.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class WorkingDay : EntityBase
    {
        #region "----Properties----"
        public int UserId { get; set; }
        public SharedEnums.Days Day { get; set; }
        public TimeSpan Start { get; set; }
        public TimeSpan End { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public User User { get; set; }
        #endregion

        #region "----Not Mapped----"
        [NotMapped]
        public string Start24
        {
            get
            {
                return this.Start.ToString("hh:MM");
            }
        }

        [NotMapped]
        public string End24
        {
            get
            {
                return this.End.ToString("hh:MM");
            }
        }
        #endregion
    }
}
