using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity
{
    class ContactUsMessage : EntityBase
    {
        #region "----Properties----"
        public int? FromUserId { get; set; }
        public string Messgae { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }

        public string MobileNumber { get; set; }

        public bool IsSeen { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public User FromUser { get; set; }
        #endregion
    }
}
