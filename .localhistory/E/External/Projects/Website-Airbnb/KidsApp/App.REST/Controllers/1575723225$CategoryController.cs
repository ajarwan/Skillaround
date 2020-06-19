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
        //private readonly Manager<categ> Mgr;

        public CategoryController()
        {
            //Mgr = new Manager<Activity>(Unit);
        }

    }
}
