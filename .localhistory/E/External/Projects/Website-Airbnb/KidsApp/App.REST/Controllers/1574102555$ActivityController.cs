using App.Business.Core;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/Activity")]
    public class ActivityController : BaseController
    {
        private readonly Manager<Activity> Mgr;

        public ActivityController()
        {
            Mgr = new Manager<Activity>(Unit);
        }

    }
}
