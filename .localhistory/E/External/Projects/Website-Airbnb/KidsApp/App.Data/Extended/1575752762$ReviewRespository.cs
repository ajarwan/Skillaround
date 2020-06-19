using App.Core;
using App.Core.Base;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class ReviewRespository : RepositoryBase<Review>
    {
        public ReviewRespository(IUnitOfWork uw) : base(uw)
        {

        }
    }

    public void FindActivityTotalRate(int ActivityId)
    {
         
    }
}
