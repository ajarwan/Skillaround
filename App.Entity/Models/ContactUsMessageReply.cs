using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class ContactUsMessageReply : EntityBase
    {

        #region "----Properties----"
        public int ContactUsMessageId { get; set; }

        public string Text { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public ContactUsMessage ContactUsMessage { get; set; }

        #endregion

    }
}
