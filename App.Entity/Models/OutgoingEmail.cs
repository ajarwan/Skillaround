using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class OutgoingEmail : EntityBase
    {
        #region "----Properties----"
        public string TextAr { get; set; }
        public string TextEn { get; set; }

        public string Subject { get; set; }

        public SharedEnums.MailReceiverType MailReceiverType { get; set; }

        public bool IsProcessing { get; set; }
        public bool IsSuccess { get; set; }

        #endregion

        #region "---Navigation Properties----"
      
        #endregion
    }
}
