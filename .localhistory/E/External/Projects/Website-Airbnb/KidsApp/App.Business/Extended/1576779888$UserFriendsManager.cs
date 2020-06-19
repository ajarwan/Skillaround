using App.Core;
using App.Core.Base;
using App.Data.Extended;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace App.Business.Extended
{
    class UserFriendsManager : BusinessBase<UserFriends>
    {
        #region "----Constructor----"
        public UserFriendsManager(IUnitOfWork uw) : base(new UserFriendRepository(uw))
        {
        }
        public UserFriendRepository RepositoryBase
        {
            get
            {
                return ((UserFriendRepository)Repository);
            }
        }
        #endregion
    }
}
