﻿using App.Core;
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

namespace App.Data.Extended
{
    public class UserFriendRepository : RepositoryBase<UserFriends>
    {
        public UserFriendRepository(IUnitOfWork uw) : base(uw)
        {

        }


        public List<int> FindUserFriendUserIds(Expression<Func<UserFriends, bool>> Filter, int UserId)
        {
            IQueryable<UserFriends> Q = this.dbSet.AsQueryable().AsNoTracking();

            if (Filter != null)
                Q = this.dbSet.Where(Filter);

            Q = Q.Where(x => x.UserId == UserId || x.FriendId == UserId);

            var res = Q.Select(x => new { UserId = x.Id, FriendId = x.FriendId }).ToList();

            var Ids = new List<int>();

            res.ForEach(x =>
            {
                Ids.Add(x.UserId);
                Ids.Add(x.FriendId);
            });

            Ids = Ids.Where(x => x != UserId).Distinct().ToList();

            return res;

        }
    }
}
