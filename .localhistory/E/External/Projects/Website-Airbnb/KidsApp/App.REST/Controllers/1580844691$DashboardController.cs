using App.Business.Extended;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/Dashboard")]
    public class DashboardController : BaseController
    {

        [Route("Counts")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindDashboardCounts()
        {
            try
            {
                UserManager UserMgr = new UserManager(Unit);
                ActivityManager ActMgr = new ActivityManager(Unit);

                var UsersCount = await UserMgr.Count_Async(x => x.IsDeleted);
                var SuppliersCount = await UserMgr.Count_Async(x => x.IsDeleted && x.IsSupplier);
                var ActivitiesCount = await ActMgr.Count_Async(x => x.IsDeleted);

                return Ok(new
                {
                    UsersCount = UsersCount,
                    SuppliersCount = SuppliersCount,
                    ActivitiesCount
                });

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

    }
}
