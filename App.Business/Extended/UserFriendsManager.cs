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
    public class UserFriendsManager : BusinessBase<UserFriends>
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

        #region "----Extended----"
        public List<int> FindUserFriendUserIds(Expression<Func<UserFriends, bool>> Filter, int UserId,string oderBy)
        {
            return RepositoryBase.FindUserFriendUserIds(Filter, UserId, oderBy);
        }

        #endregion
    }
}
