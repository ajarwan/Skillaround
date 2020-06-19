using App.Business.Core;
using App.Business.Extended;
using App.Core;
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
        private readonly Manager<Statistic> Mgr;
        public StatisticsController()
        {
            Mgr = new Manager<Statistic>(Unit);
        }


        [Route("")]
        [HttpPost]
        public async Task<IHttpActionResult> AddStatistic(Statistic statistic)
        {
            try
            {
                statistic.State = BaseState.Added;
                Mgr.AddUpdate(statistic);
                await Unit.SaveChanges_Async();

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
        public async Task<IHttpActionResult> AddStatistics(List<Statistic> statistic)
        {
            try
            {
                statistic.ForEach(x =>
                {
                    x.State = BaseState.Added;
                });


                Mgr.AddUpdate(statistic);
                await Unit.SaveChanges_Async();

                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
