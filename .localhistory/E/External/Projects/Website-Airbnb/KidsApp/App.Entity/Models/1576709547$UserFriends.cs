using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class UserFriends : EntityBase
    {

        #region "----Properties----"
        public int UserId { get; set; }
        public int FriendId { get; set; }

        public SharedEnums.AcceptStatus AcceptStatus { get; set; }
        #endregion

        #region "----Navigation Properties----"
        public User User { get; set; }
        public User Friend { get; set; }
        #endregion

    }
}
