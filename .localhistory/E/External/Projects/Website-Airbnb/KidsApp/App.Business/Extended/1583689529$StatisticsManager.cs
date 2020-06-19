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
    public class StatisticsManager : BusinessBase<Statistic>
    {
        #region "----Constructor----"
        public StatisticsManager(IUnitOfWork uw) : base(new StatisticsRepository(uw))
        {
        }
        public StatisticsRepository RepositoryBase
        {
            get
            {
                return ((StatisticsRepository)Repository);
            }
        }
        #endregion

        #region "----Extended----"
        public async Task<SupplierActivityViewStatistics> FindSupplierActivityViewStatistics(int activityId)
        {
            return await RepositoryBase.FindSupplierActivityViewStatistics(activityId);

        }
        #endregion
    }
}
