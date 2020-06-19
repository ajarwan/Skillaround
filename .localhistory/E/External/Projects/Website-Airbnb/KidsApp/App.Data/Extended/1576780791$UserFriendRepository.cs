using App.Core;
using App.Core.Base;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using EntityFramework.Extensions;

namespace App.Data.Extended
{
    public class UserFriendRepository : RepositoryBase<UserFriends>
    {
        public UserFriendRepository(IUnitOfWork uw) : base(uw)
        {

        }


        public List<int> FindUserFriendUserIds(Expression<Func<UserFriends, bool>> Filter, int UserId, string oderBy)
        {
            IQueryable<UserFriends> Q = this.dbSet.AsQueryable().AsNoTracking();

            if (Filter != null)
                Q = this.dbSet.Where(Filter);

            Q = Q.Where(x => x.UserId == UserId || x.FriendId == UserId);

            if (string.IsNullOrEmpty(oderBy))
                Q = Q.OrderBy(oderBy);

            var res = Q.Select(x => x.UserId == UserId ? x.FriendId : x.UserId).ToList();
            return res;
            //var res = Q.Select(x => new { UserId = x.Id, FriendId = x.FriendId }).ToList();

            //var Ids = new List<int>();

            //res.ForEach(x =>
            //{
            //    Ids.Add(x.UserId);
            //    Ids.Add(x.FriendId);
            //});

            //Ids = Ids.Where(x => x != UserId).Distinct().ToList();

            //return Ids;



        }
    }
}
