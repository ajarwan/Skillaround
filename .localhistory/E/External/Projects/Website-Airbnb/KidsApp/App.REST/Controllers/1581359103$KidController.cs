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
    }
}
