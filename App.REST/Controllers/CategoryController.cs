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
    [RoutePrefix("Api/Category")]
    public class CategoryController : BaseController
    {
        private readonly Manager<Category> Mgr;

        public CategoryController()
        {
            Mgr = new Manager<Category>(Unit);
        }


        [Route("{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> FindCategoryById([FromUri]int id, string include = null)
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
        public async Task<IHttpActionResult> FindAllCategories(string title = null,
            SharedEnums.ActivationStatus activationStatus = SharedEnums.ActivationStatus.Active, int pageIndex = 1, int pageSize = 10,
            string include = null, string orderBy = "CreateDate DESC")
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<Category, bool>> Filter = x => !x.IsDeleted;

                if (!string.IsNullOrWhiteSpace(title))
                {
                    title = title.ToLower().Trim();
                    Filter = Filter.And((x) => x.TitleAr.ToLower().Trim().Contains(title) || x.TitleEn.ToLower().Trim().Contains(title));
                }


                if (activationStatus == SharedEnums.ActivationStatus.Active)
                    Filter = Filter.And(x => x.IsActive);
                if (activationStatus == SharedEnums.ActivationStatus.InActive)
                    Filter = Filter.And(x => !x.IsActive);


                var categories = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(categories);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        public IHttpActionResult AddCategory(Category category)
        {
            try
            {
                if (ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();

                category.State = BaseState.Added;
                Mgr.AddUpdate(category);
                Unit.SaveChanges();
                return Ok(category);
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
        public IHttpActionResult UpdateCategory(Category category)
        {
            try
            {
                if (ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();

                category.State = BaseState.Modified;
                Mgr.AddUpdate(category);
                Unit.SaveChanges();
                return Ok(category);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
