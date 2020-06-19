using App.Business.Core;
using App.Core;
using App.Entity;
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
    [RoutePrefix("Api/UserDocument")]
    public class UserDocumentController : BaseController
    {
        private readonly Manager<UserDocument> Mgr;

        public UserDocumentController()
        {
            Mgr = new Manager<UserDocument>(Unit);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> FindUserDocumentById([FromUri]int id, string include = null)
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }

        [Route("FindAll")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllDocuments(int userId, int? id = null,
             int pageIndex = 1, int pageSize = 10, string orderBy = "Id DESC", string include = null,
             string documentTypes = null)
        {
            try
            {

                System.Threading.Thread.Sleep(5000);

                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;
                Expression<Func<UserDocument, bool>> Filter = x => !x.IsDeleted;


                var Types = new List<SharedEnums.DocumentType>();

                if (!string.IsNullOrEmpty(documentTypes))
                {
                    Types = Helper.ToIntArray(documentTypes).Select(x => (SharedEnums.DocumentType)x).ToList();
                }




                Filter = Filter.And(x => x.UserId == userId);

                if (id.HasValue)
                    Filter = Filter.And(x => x.Id == id.Value);

                if (Types.Count > 0)
                {
                    Filter = Filter.And(x => Types.Contains(x.DocumentType));
                }


                var docs = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(docs);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult AddUserDocument(UserDocument userDocument)
        {
            try
            {
                userDocument.State = BaseState.Added;
                Mgr.AddUpdate(userDocument);
                Unit.SaveChanges();
                return Ok(userDocument);
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
        public IHttpActionResult UpdateUserDocument(UserDocument userDocument)
        {
            try
            {
                userDocument.State = BaseState.Modified;
                Mgr.AddUpdate(userDocument);
                Unit.SaveChanges();
                return Ok(userDocument);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }

        [Route("FindAllMyDocuments")]
        [KidsAppAuthorization]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllMyDocuments()
        {
            try
            {

                Expression<Func<UserDocument, bool>> Filter = x => !x.IsDeleted && x.UserId == this.ActiveUser.Id;

                var docs = await Mgr.FindAll_Async(Filter, "Id", null, null);


                return Ok(docs);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }
    }
}
