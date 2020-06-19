using App.Core;
using App.Core.Base;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class ReviewRespository : RepositoryBase<Review>
    {
        public ReviewRespository(IUnitOfWork uw) : base(uw)
        {

        }


        public decimal FindActivityTotalRate(Expression<Func<Review, bool>> Filter)
        {
            return dbSet.Where(Filter).Select(x => x.Rate).Sum();
        }

    }

  
}
