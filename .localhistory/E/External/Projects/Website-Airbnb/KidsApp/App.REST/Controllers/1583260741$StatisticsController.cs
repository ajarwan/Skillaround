using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace App.REST.Controllers
{
    [RoutePrefix("Api/Statistic")]
    public class StatisticsController : BaseController
    {
        private readonly StatisticsManager Mgr;
        public StatisticsController()
        {
            Mgr = new StatisticsManager(Unit);
        }


        [Route("")]
        [HttpPost]
        public async Task<IHttpActionResult> AddStatistic(Statistic statistic)
        {
            try
            {


                Expression<Func<Statistic, bool>> Filter = x => x.Type == statistic.Type;
                Filter = Filter.And(x => x.ActivityId == statistic.ActivityId);

                if (this.ActiveUser != null)
                    Filter = Filter.And(x => x.UserId == this.ActiveUser.Id);
                else
                    Filter = Filter.And(x => x.UniqueId == statistic.UniqueId);

                if (Mgr.Count(Filter) > 0)
                {
                    return Ok(false);
                }

                statistic.State = BaseState.Added;
                Mgr.AddUpdate(statistic);
                Unit.SaveChanges();

                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("List")]
        [HttpPost]
        public async Task<IHttpActionResult> AddStatistics(List<Statistic> statistics)
        {
            try
            {

                statistics.ForEach((statistic) =>
                {
                    Expression<Func<Statistic, bool>> Filter = x => x.Type == statistic.Type;
                    Filter = Filter.And(x => x.ActivityId == statistic.ActivityId);
                    if (this.ActiveUser != null)
                        Filter = Filter.And(x => x.UserId == this.ActiveUser.Id);
                    else
                        Filter = Filter.And(x => x.UniqueId == statistic.UniqueId);

                    if (Mgr.Count(Filter) > 0)
                        statistic.State = BaseState.Unchanged;
                    else
                        statistic.State = BaseState.Added;
                });

                statistics = statistics.Where(x => x.State == BaseState.Added).ToList();

                Mgr.AddUpdate(statistics);
                Unit.SaveChanges();

                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        [Route("ActivityViewStatistics")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindSupplierActivityViewStatistics(int activityId)
        {
            try
            {
                if (!this.ActiveUser.IsSupplier || this.ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();


                var res = await Mgr.FindSupplierActivityViewStatistics(activityId);


                return Ok(res);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
