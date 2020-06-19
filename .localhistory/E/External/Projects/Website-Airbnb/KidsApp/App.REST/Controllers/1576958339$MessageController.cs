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
    [RoutePrefix("Api/Message")]
    public class MessageController : BaseController
    {
        private readonly Manager<MessagingQueue> Mgr;
        public MessageController()
        {
            Mgr = new Manager<MessagingQueue>(Unit);
        }

        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult AddMessageQueue(MessagingQueue MessagingQueue)
        {
            try
            {
                MessagingQueue.FromUserId = this.ActiveUser.Id;
                MessagingQueue.State = BaseState.Added;
                Mgr.AddUpdate(MessagingQueue);
                Unit.SaveChanges();
                return Ok(MessagingQueue);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
