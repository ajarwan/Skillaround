using App.Business.Core;
using App.Core;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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
        public async Task<IHttpActionResult> FindAllUsers()
        {
            try
            {
                Pagger pager = new Pagger() { PageSize = 10, PageIndex = 1 }; ;


                Expression<Func<User, bool>> Filter = x => !x.IsDeleted;

                var users = await Mgr.FindAll_Async(Filter, orderBy, pager, Includes);


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
