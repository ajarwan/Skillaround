using App.Business.Core;
using App.Business.Extended;
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
    [RoutePrefix("Api/Review")]
    public class StatisticsController : BaseController
    {
        private readonly Manager<Statistic> Mgr;
        public StatisticsController()
        {
            Mgr = new Manager<Statistic>(Unit);
        }

    }
}
