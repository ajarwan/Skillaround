using App.Core;
using App.Core.Base;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class ActivityRepository : RepositoryBase<Activity>
    {
        public ActivityRepository(IUnitOfWork uw) : base(uw)
        {

        }


        public PriceRange FindActivityPriceRange(Expression<Func<Activity, bool>> Filter)
        {
            var min = dbSet.Where(Filter).Select(x => (int?)x.Price).Max() ?? default(int);
            var max = dbSet.Where(Filter).Select(x => (int?)x.Price).Min() ?? default(int);

            if (max == 0)
                max = 1000;

            if (min == max)
                max += 1000;

            return new PriceRange() { MinPrice = min, MaxPrice = max };

        }

    }
}
