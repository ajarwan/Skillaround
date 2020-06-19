using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class ContentAdmin : EntityBase
    {
        #region "----Properties----"
        public SharedEnums.ContentAdminType Type { get; set; }

        public string ContentAr { get; set; }
        public string ContentEn { get; set; }

        #endregion
    }
}
