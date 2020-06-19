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
    [RoutePrefix("Api/Kid")]
    public class KidController : BaseController
    {
        private readonly Manager<Kid> Mgr;

        public KidController()
        {
            Mgr = new Manager<Kid>(Unit);
        }

        [Route("FindAll")]
        [KidsAppAuthorization]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllKids(int? parentId = null, int pageIndex = 1, int pageSize = 10, string include = null, string orderBy = "CreateDate DESC")
        {
            try
            {

                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<Kid, bool>> Filter = x => !x.IsDeleted;

                if (parentId.HasValue)
                    Filter = Filter.And(x => x.ParentId == parentId.Value);


                var kids = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(kids);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult AddKid(Kid kid)
        {
            try
            {
                if (this.ActiveUser.Id != kid.ParentId)
                    return BadRequest();

                kid.State = BaseState.Added;
                Mgr.AddUpdate(kid);
                Unit.SaveChanges();

                return Ok(kid);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPut]
        [KidsAppAuthorization]
        public IHttpActionResult UpdateKid(Kid kid)
        {
            try
            {
                if (this.ActiveUser.Id != kid.ParentId)
                    return BadRequest();

                kid.State = BaseState.Modified;
                Mgr.AddUpdate(kid);
                Unit.SaveChanges();

                return Ok(kid);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [KidsAppAuthorization]
        public IHttpActionResult DeleteKid([FromUri]int id)
        {
            try
            {

                var kid = Mgr.FindById(id);

                if (this.ActiveUser.Id != kid.ParentId)
                    return BadRequest();

                kid.IsDeleted = true;
                kid.State = BaseState.Deleted;
                Mgr.AddUpdate(kid);
                Unit.SaveChanges();

                return Ok(kid);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
