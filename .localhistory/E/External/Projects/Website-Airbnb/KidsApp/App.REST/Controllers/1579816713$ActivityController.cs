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
    [RoutePrefix("Api/Activity")]
    public class ActivityController : BaseController
    {
        private readonly ActivityManager Mgr;

        public ActivityController()
        {
            Mgr = new ActivityManager(Unit);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> FindActivityById([FromUri]int id, string include = null)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest();
                }

                var res = await Mgr.FindById_Async(id, Helper.ToStringArray(include));

                return Ok(res);
            }
            catch (Exception ex)
            {

                return InternalServerError(ex);
            }
        }

        [Route("FindAll")]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllActivities(string title = null, string description = null,
            string locationId = null, string locationName = null, int? ageFrom = null,
            int? ageTo = null, DateTime? fromDate = null, DateTime? toDate = null,
            SharedEnums.TransportationFilter transportation = SharedEnums.TransportationFilter.All,
            SharedEnums.ActivityPostStatus postStatus = SharedEnums.ActivityPostStatus.Posted, bool myActivities = false, int pageIndex = 1, int pageSize = 10,
            string include = null, string orderBy = "CreateDate DESC", int? categoryId = null, int? maxPrice = null, int? minPrice = null)
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

                if (categoryId.HasValue)
                    Filter = Filter.And((x) => x.CategoryId == categoryId.Value);

                if (maxPrice.HasValue)
                    Filter = Filter.And((x) => x.Price <= maxPrice.Value);

                if (minPrice.HasValue)
                    Filter = Filter.And((x) => x.Price >= minPrice.Value);



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
                //if(this.ActiveUser.IsSupplier)
                if (postStatus != SharedEnums.ActivityPostStatus.All)
                {
                    if (postStatus == SharedEnums.ActivityPostStatus.Posted)
                        Filter = Filter.And(x => x.IsPosted);
                    else
                        Filter = Filter.And(x => !x.IsPosted);
                }



                if (myActivities)
                    Filter = Filter.And(x => x.SupplierId == this.ActiveUser.Id);

                var activities = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


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

        [Route("FindAllMarks")]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllMarks(decimal gLat, decimal gLng, decimal sLat, decimal sLng, string locationId = null,
            int? ageFrom = null,
           int? ageTo = null, DateTime? fromDate = null, DateTime? toDate = null,
           SharedEnums.TransportationFilter transportation = SharedEnums.TransportationFilter.All,
           bool isPosted = true, bool myActivities = false, int? categoryId = null, int? maxPrice = null, int? minPrice = null)
        {
            try
            {
                Pager pager = new Pager() { PageSize = 25, PageIndex = 1 }; ;


                Expression<Func<Activity, bool>> Filter = x => !x.IsDeleted;


                Filter = Filter.And(x => x.Lat >= sLat && x.Lat <= gLat);
                Filter = Filter.And(x => x.Lng >= sLng && x.Lng <= gLng);

                if (ageFrom.HasValue)
                    Filter = Filter.And((x) => x.AgeFrom >= ageFrom);


                if (ageTo.HasValue)
                    Filter = Filter.And((x) => x.AgeTo >= ageTo);

                if (categoryId.HasValue)
                    Filter = Filter.And((x) => x.CategoryId == categoryId.Value);

                if (maxPrice.HasValue)
                    Filter = Filter.And((x) => x.Price <= maxPrice.Value);

                if (minPrice.HasValue)
                    Filter = Filter.And((x) => x.Price >= minPrice.Value);



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

                var marks = await Mgr.FindAllMarks(Filter);


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(marks);
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
                if (this.ActiveUser.Id != activity.SupplierId)
                    return BadRequest();

                activity.State = BaseState.Added;
                Mgr.AddUpdate(activity);
                Unit.FlushChanges();

                if (activity.Documents != null)
                {
                    var mainImg = activity.Documents.Where((x) => x.IsMain && !x.IsDeleted).FirstOrDefault();
                    if (mainImg != null)
                    {
                        activity.ThumbnailId = mainImg.Id;
                        activity.State = BaseState.Modified;
                        Mgr.AddUpdate(activity);
                         
                    }
                }
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


        [Route("PriceRange")]
        [HttpGet]
        public IHttpActionResult FindActivityPriceRange(Activity activity)
        {
            try
            {
                Expression<Func<Activity, bool>> Filter = x => !x.IsDeleted && x.IsPosted;
                return Ok(Mgr.FindActivityPriceRange(Filter));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [Route("AvailableCapacity")]
        [HttpGet]
        public IHttpActionResult FindAvailableCapacityCount(int activityId)
        {
            try
            {
                return Ok(Mgr.FindAvailableCapacityCount(activityId));
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
