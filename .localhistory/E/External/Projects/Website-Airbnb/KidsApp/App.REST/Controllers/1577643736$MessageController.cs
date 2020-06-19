using App.Business;
using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
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

                if (MessagingQueue.MessageType == SharedEnums.MessageType.Email)
                {
                    Manager<User> UserManager = new Manager<User>(Unit);
                    var email = UserManager.FindById(MessagingQueue.ToUserId).Email;

                    var MsgTitle = "";

                    if (UnitOfWork.Language == LanguageEnum.Arabic)
                        MsgTitle = ConfigurationManager.AppSettings["EmailSubjectAr"].ToString();
                    else
                        MsgTitle = ConfigurationManager.AppSettings["EmailSubjectEn"].ToString();


                    MailSender.SendEmail(MsgTitle, MessagingQueue.Message, email);
                }


                return Ok(MessagingQueue);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
