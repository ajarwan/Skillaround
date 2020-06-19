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
    [RoutePrefix("Api/ContentAdmin")]
    public class ContentAdminController : BaseController
    {
        private readonly Manager<ContentAdmin> Mgr;

        public ContentAdminController()
        {
            Mgr = new Manager<ContentAdmin>(Unit);
        }

        //find by type
        //update

        [Route("FindByType")]
        [HttpGet]
        public async Task<IHttpActionResult> FindContentAdminByType(SharedEnums.ContentAdminType type)
        {
            try
            {
                Expression<Func<ContentAdmin, bool>> Filter = x => !x.IsDeleted && x.Type == type;

                var res = await Mgr.FindAll_Async(Filter, "Id", null, null);

                return Ok(res.FirstOrDefault());
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
        public IHttpActionResult UpdateContentAdmin(ContentAdmin contentAdmin)
        {
            try
            {

                if (ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();

                contentAdmin.State = BaseState.Modified;
                Mgr.AddUpdate(contentAdmin);
                Unit.SaveChanges();


                return Ok(contentAdmin);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
