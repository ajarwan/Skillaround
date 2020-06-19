using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class MessagingQueue:  EntityBase
    {
        #region "----Properties----"
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
         
        public string Message { get; set; }
         
        public SharedEnums.MessageType MessageType { get; set; }

        public bool IsSeen { get; set; }
        #endregion

        #region "----Navigation Propertis----"
        public User FromUser { get; set; }
        public User ToUserUser { get; set; }
        #endregion


    }
}
