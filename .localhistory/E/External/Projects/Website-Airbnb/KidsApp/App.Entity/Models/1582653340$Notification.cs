using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Notification : EntityBase
    {
        #region "----Properties----"
        public int ToUserId { get; set; }

        public int? FromUserId { get; set; }
        public string TextAr { get; set; }
        public string TextEn { get; set; }
        public int? MessagingQueueId { get; set; }
        public SharedEnums.NotificationType Type { get; set; }

        public int? UserFriends { get; set; }

        public int? RelatedBookingId { get; set; }

        public bool IsSeen { get; set; }
        #endregion

        #region "----Navigation Propertis----"
        public User ToUser { get; set; }
        public User FromUser { get; set; }
        public MessagingQueue MessagingQueue { get; set; }
        
        public Booking RelatedBooking { get; set; }
        public UserFriends UserFriend { get; set; }
        #endregion
    }
}
