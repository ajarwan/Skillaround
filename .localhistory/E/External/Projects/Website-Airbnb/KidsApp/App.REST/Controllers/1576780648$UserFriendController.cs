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

    [RoutePrefix("Api/UserFriend")]

    public class UserFriendController : BaseController
    {
        private readonly Manager<UserFriends> Mgr;

        public UserFriendController()
        {
            Mgr = new Manager<UserFriends>(Unit);
        }


        [Route("FindAll")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllFriends(int pageIndex = 1, int pageSize = 12, string include = null,
            string orderBy = "CreateDate DESC", bool onlyRequest = false)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<UserFriends, bool>> Filter = x => !x.IsDeleted && x.UserId == ActiveUser.Id;


                if (onlyRequest)
                    Filter = Filter.And(x => x.AcceptStatus == SharedEnums.AcceptStatus.Pending);
                else
                    Filter = Filter.And(x => x.AcceptStatus == SharedEnums.AcceptStatus.Accepted);


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
    }
}
