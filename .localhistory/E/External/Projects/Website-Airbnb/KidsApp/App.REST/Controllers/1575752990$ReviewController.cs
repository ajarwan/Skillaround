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
    [RoutePrefix("Api/Review")]

    public class ReviewController : BaseController
    {
        private readonly ReviewManager Mgr;

        public ReviewController()
        {
            Mgr = new ReviewManager(Unit);
        }
        [Route("{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> FindReviewById([FromUri]int id, string include = null)
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
        public async Task<IHttpActionResult> FindAllReviews(int activityId, int? id = null,
            int pageIndex = 1, int pageSize = 10, string orderBy = "Id DESC", string include = null, int? userId = null)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<Review, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => x.ActivityId == activityId);

                if (id.HasValue)
                    Filter = Filter.And((x) => x.Id >= id.Value);


                if (userId.HasValue)
                    Filter = Filter.And((x) => x.UserId == userId.Value);


                var docs = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(docs);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult AddReview(Review review)
        {
            try
            {
                review.State = BaseState.Added;
                Mgr.AddUpdate(review);
                Unit.SaveChanges();
                return Ok(review);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPut]
        public IHttpActionResult UpdateReview(Review review)
        {
            try
            {
                review.State = BaseState.Modified;
                Mgr.AddUpdate(review);
                Unit.SaveChanges();
                return Ok(review);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [Route("FindActivityReviewStatistics")]
        [HttpGet]
        public async Task<IHttpActionResult> FindActivityReviewStatistics(int activityId)
        {
            try
            {



                Expression<Func<Review, bool>> Filter = x => !x.IsDeleted;
                Filter = Filter.And(x => x.ActivityId == activityId);
                var TotalReviews = Mgr.Count(Filter);
                var TotalRate = Mgr.FindActivityTotalRate(Filter);

                var res = new
                {
                    TotalReviews = TotalReviews,
                    AvgRate = Math.Round(TotalRate / TotalReviews, 2)

                };

                return Ok(res);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
