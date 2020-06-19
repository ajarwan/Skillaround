using App.Business.Core;
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
    [RoutePrefix("Api/Activity")]
    public class ActivityController : BaseController
    {
        private readonly Manager<Activity> Mgr;

        public ActivityController()
        {
            Mgr = new Manager<Activity>(Unit);
        }

        [Route("FindAll")]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllActivities(string title = null, string description = null,
            string locationId = null, string locationName = null, int? ageFrom = null,
            int? ageTo = null, DateTime? fromDate = null, DateTime? toDate = null,
            SharedEnums.TransportationFilter transportation = SharedEnums.TransportationFilter.All,
            bool isPosted = true, bool myActivities = false, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<Activity, bool>> Filter = x => !x.IsDeleted;

                if (!string.IsNullOrWhiteSpace(title))
                {
                    title = title.ToLower().Trim();
                    Filter = Filter.And((x) => x.Title.ToLower().Trim().Contains(title));
                }

                if (!string.IsNullOrWhiteSpace(description))
                {
                    description = description.ToLower().Trim();
                    Filter = Filter.And((x) => x.Description.ToLower().Trim().Contains(description));
                }

                if (!string.IsNullOrWhiteSpace(locationId))
                {
                    locationId = locationId.ToLower().Trim();
                    Filter = Filter.And((x) => x.LocationId.ToLower().Trim() == locationId);
                }

                if (!string.IsNullOrWhiteSpace(locationName))
                {
                    locationName = locationName.ToLower().Trim();
                    Filter = Filter.And((x) => x.LocationName.ToLower().Trim() == locationName);
                }

                if (ageFrom.HasValue)
                    Filter = Filter.And((x) => x.AgeFrom >= ageFrom);


                if (ageTo.HasValue)
                    Filter = Filter.And((x) => x.AgeTo >= ageTo);



                if (fromDate.HasValue && toDate.HasValue)
                {

                    Filter = Filter.And(x => (DbFunctions.TruncateTime(x.From) >= DbFunctions.TruncateTime(fromDate) && DbFunctions.TruncateTime(x.From) <= DbFunctions.TruncateTime(toDate)) ||
                                     (DbFunctions.TruncateTime(x.To) >= DbFunctions.TruncateTime(fromDate) && DbFunctions.TruncateTime(x.To) <= DbFunctions.TruncateTime(toDate)) ||
                                     (DbFunctions.TruncateTime(x.From) <= DbFunctions.TruncateTime(fromDate) && DbFunctions.TruncateTime(x.To) >= DbFunctions.TruncateTime(toDate)));

                }
                else if (fromDate.HasValue || toDate.HasValue)
                {
                    if (fromDate.HasValue)
                    {
                        Filter = Filter.And(x => DbFunctions.TruncateTime(x.From) >= DbFunctions.TruncateTime(fromDate));
                    }
                    else
                    {
                        Filter = Filter.And(x => DbFunctions.TruncateTime(x.To) <= DbFunctions.TruncateTime(toDate));
                    }
                }

                switch (transportation)
                {
                    case SharedEnums.TransportationFilter.Available:
                        Filter = Filter.And(x => x.Transportation);
                        break;
                    case SharedEnums.TransportationFilter.NotAvailable:
                        Filter = Filter.And(x => !x.Transportation);
                        break;
                    default:
                        break;

                }

                //TODO 
                //if(Unit.UserId.IsSupplier)
                Filter = Filter.And(x => x.IsPosted == isPosted);

                if (myActivities)
                    Filter = Filter.And(x => x.SupplierId == Unit.UserId);

                var activities = await Mgr.FindAll_Async(Filter, "CreateDate DESC", pager, null);


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(activities);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult AddActivity(Activity activity)
        {
            try
            {
                activity.State = BaseState.Added;
                Mgr.AddUpdate(activity);
                Unit.SaveChanges();
                return Ok(activity);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPut]
        public IHttpActionResult UpdateActivity(Activity activity)
        {
            try
            {
                activity.State = BaseState.Modified;
                Mgr.AddUpdate(activity);
                Unit.SaveChanges();
                return Ok(activity);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
