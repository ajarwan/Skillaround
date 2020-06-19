using App.Business.Core;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/User")]
    public class UserController : BaseController
    {
        private readonly Manager<User> Mgr;
        public UserController()
        {
            Mgr = new Manager<User>(Unit);
        }

        [Route("FindAll")]
        [HttpGet]

        public async Task<IHttpActionResult> FindAllAttendeesServices(
     int scheduleItemId,
     string attendeesIds = null,
     Guid? inviteesId = null,
     string destinationsIds = null,
     string include = null,
     int page = 1,
     int pageSize = 10,
     string orderBy = null,
     bool checkIsPublish = true,
     bool isPublishConfirmed = true)
        {
            try
            {
                Pagger pager = new Pagger() { PageSize = pageSize, PageIndex = page }; ;
                var Includes = Helper.ToStringArray(include);


                Expression<Func<AttendeeService, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => x.ScheduleItemId == scheduleItemId);

                if (checkIsPublish)
                    Filter = Filter.And(x => x.IsPublishConfirmed == isPublishConfirmed);

                if (!string.IsNullOrEmpty(attendeesIds))
                {
                    var AttendeesIds = Helper.ToIntArray(attendeesIds);
                    Filter = Filter.And(x => AttendeesIds.Contains(x.AttendeeId));
                }

                if (inviteesId != null)
                {
                    Filter = Filter.And(x => x.Attendee.InviteeId == inviteesId);
                }

                if (!string.IsNullOrEmpty(destinationsIds))
                {
                    var DestinationsIds = Helper.ToIntArray(destinationsIds);
                    Filter = Filter.And(x => DestinationsIds.Contains(x.DestinationId.Value));
                }

                var Services = await Mgr.FindAll_Async(Filter, orderBy, pager, Includes);


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(Services);
            }
            catch (Exception ex)
            {
                Unit.Logger.Error(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Logger");
                HttpContext.Current.Response.Headers.Add("X-Logger", Unit.Logger.Transaction.ToString());
                return InternalServerError(ex);
            }
        }
    }
}
