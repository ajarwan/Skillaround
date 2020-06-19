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
    public class Kid : EntityBase
    {
        #region"----Properties----"
        public string KidName { get; set; }

        public SharedEnums.Gender Gender { get; set; }

        public DateTime? DOB { get; set; }

        public int ParentId { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public User Parent { get; set; }
        #endregion
    }
}
