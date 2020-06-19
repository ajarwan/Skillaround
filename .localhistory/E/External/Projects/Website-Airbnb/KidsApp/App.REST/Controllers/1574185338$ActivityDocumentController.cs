﻿using App.Business.Core;
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
    [RoutePrefix("Api/ActivityDocument")]
    public class ActivityDocumentController : BaseController
    {
        private readonly Manager<ActivityDocument> Mgr;

        public ActivityDocumentController()
        {
            Mgr = new Manager<ActivityDocument>(Unit);
        }

        [Route("FindAll")]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllActivityDocument(int activityId, int? id = null,
            bool onlyMain = false, int pageIndex = 1, int pageSize = 10, string orderBy = "IsMain", string include = null)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<ActivityDocument, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => x.ActivityId == activityId);

                if (id.HasValue)
                    Filter = Filter.And((x) => x.Id >= id.Value);


                if (onlyMain)
                    Filter = Filter.And((x) => x.IsMain);


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

    }
}
