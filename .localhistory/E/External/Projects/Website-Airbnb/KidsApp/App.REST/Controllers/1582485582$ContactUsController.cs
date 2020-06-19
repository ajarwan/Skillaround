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
    [RoutePrefix("Api/ContactUs")]
    public class ContactUsController : BaseController
    {

        private readonly Manager<ContactUsMessage> Mgr;

        public ContactUsController()
        {
            Mgr = new Manager<ContactUsMessage>(Unit);
        }


        [Route("")]
        [HttpPost]
        public IHttpActionResult AddMessageQueue(ContactUsMessage ContactUsMessage)
        {
            try
            {

                ContactUsMessage.State = BaseState.Added;
                Mgr.AddUpdate(ContactUsMessage);
                Unit.SaveChanges();

                //if (MessagingQueue.MessageType == SharedEnums.MessageType.Email)
                //{
                //    Manager<User> UserManager = new Manager<User>(Unit);
                //    var email = UserManager.FindById(MessagingQueue.ToUserId).Email;

                //    var MsgTitle = "";

                //    if (UnitOfWork.Language == LanguageEnum.Arabic)
                //        MsgTitle = ConfigurationManager.AppSettings["EmailSubjectAr"].ToString();
                //    else
                //        MsgTitle = ConfigurationManager.AppSettings["EmailSubjectEn"].ToString();


                //    MailSender.SendEmail(MsgTitle, MessagingQueue.Message, email);
                //}

                return Ok(ContactUsMessage);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
