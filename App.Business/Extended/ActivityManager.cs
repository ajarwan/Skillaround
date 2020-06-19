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
    public class ActivityManager : BusinessBase<Activity>
    {
        #region "----Constructor----"
        public ActivityManager(IUnitOfWork uw) : base(new ActivityRepository(uw))
        {
        }
        public ActivityRepository RepositoryBase
        {
            get
            {
                return ((ActivityRepository)Repository);
            }
        }
        #endregion

        #region "----Extended----"
        public PriceRange FindActivityPriceRange(Expression<Func<Activity, bool>> Filter)
        {
            return RepositoryBase.FindActivityPriceRange(Filter);
        }

        public Task<List<ActivityMapMark>> FindAllMarks(Expression<Func<Activity, bool>> Filter)
        {
            return RepositoryBase.FindAllMarks(Filter);
        }

        public bool CheckAvailability(int ActivityId, int count)
        {
            return RepositoryBase.CheckAvailability(ActivityId, count);
        }

        public List<OrderBy<Activity>> DynamicOrderBy(string orderBy, int? EntityId = null)
        {
            var OrderByList = new List<OrderBy<Activity>>();
            if (!string.IsNullOrEmpty(orderBy))
            {
                List<string> orders = orderBy.Split(',').ToList();
                orders.ForEach(x =>
                {
                    if (x.Contains("["))
                    {
                        var ComplexOrder = x.Split(' ').ToList();
                        switch (ComplexOrder[0].Trim())
                        {
                            case "[Reviews.Rate]":
                                OrderByList.Add(OrderBy<Activity>.Add(y => y.Reviews.Where(z => !z.IsDeleted).OrderBy(z => z.Rate).Select(z => z.Rate).Sum(), ComplexOrder.Count > 1 ? ComplexOrder[1].DecodeDirection() : OrderDirection.ASC));
                                break;
                        }
                    }
                    else
                    {
                        OrderByList.Add(OrderBy<Activity>.Add(x));
                    }
                });
            }

            return OrderByList;
        }
        #endregion
    }
}
