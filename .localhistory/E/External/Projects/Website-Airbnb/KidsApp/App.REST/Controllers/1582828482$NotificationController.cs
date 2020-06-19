using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace App.REST.Controllers
{
    [RoutePrefix("Api/Notification")]
    public class NotificationController : BaseController
    {
        private readonly Manager<Notification> Mgr;

        public NotificationController()
        {
            Mgr = new Manager<Notification>(Unit);
        }


        [Route("Count")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindNotificationsCount()
        {
            try
            {
                Expression<Func<Notification, bool>> Filter = x => !x.IsDeleted;
                Filter = Filter.And(x => x.ToUserId == this.ActiveUser.Id);

                Filter = Filter.And(x => !x.IsSeen);

                var count = await Mgr.Count_Async(Filter);

                return Ok(count);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


    }
}
