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
    class ActivityManager : BusinessBase<Activity>
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
        #endregion
    }
}
