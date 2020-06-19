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


        [Route("FindAll")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllNotifications(SharedEnums.SeenStatus status = SharedEnums.SeenStatus.NotSeen,
            SharedEnums.NotificationType type = SharedEnums.NotificationType.All, int pageIndex = 1, int pageSize = 10,
            string include = null, string orderBy = "CreateDate DESC")
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;



                Expression<Func<Notification, bool>> Filter = x => !x.IsDeleted;
                Filter = Filter.And(x => x.ToUserId == this.ActiveUser.Id);

                if (status != SharedEnums.SeenStatus.All)
                {
                    if (status == SharedEnums.SeenStatus.Seen)
                        Filter = Filter.And(x => x.IsSeen);
                    else
                        Filter = Filter.And(x => !x.IsSeen);
                }

                if (type != SharedEnums.NotificationType.All)
                {
                    Filter = Filter.And(x => x.Type == type);
                }

                var includes = Helper.ToStringArray(include);

                var notifications = await Mgr.FindAll_Async(Filter, orderBy, pager, includes);


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

    }
}
