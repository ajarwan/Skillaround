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
    [RoutePrefix("Api/ContactUsMessageReply")]

    public class ContactUsMessageReplyController : BaseController
    {
        private readonly Manager<ContactUsMessageReply> Mgr;

        public ContactUsMessageReplyController()
        {
            Mgr = new Manager<ContactUsMessageReply>(Unit);
        }

        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult AddContactUsMessageReply(ContactUsMessageReply reply)
        {
            try
            {
                if (this.ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();




                //Send Email
                var TemplatePath = Helper.GetTemplateLocationByName("ReplyEmailTemplate.html");
                string text = System.IO.File.ReadAllText(TemplatePath);

                //Common
                text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());
                text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());
                text = text.Replace("{{EmailAboutBody}}", App.Entity.Resources.KidsApp.AboutEmailBody);

                //Message details
                text = text.Replace("{{ReplyToYourMessageTitle}}", App.Entity.Resources.KidsApp.ContactUsReply);
                text = text.Replace("{{YourMessageTitle}}", App.Entity.Resources.KidsApp.YourMessage);
                text = text.Replace("{{YourMessageBody}}", reply.ContactUsMessage.Messgae);
                text = text.Replace("{{ResponseMessage}}", reply.Text);

                MailSender.SendEmail(App.Entity.Resources.KidsApp.ContactUsReply, text, reply.ContactUsMessage.Email);


                //Save Reply
                reply.State = BaseState.Added;
                reply.ContactUsMessage.IsReplied = true;
                reply.ContactUsMessage.State = BaseState.Modified;
                Mgr.AddUpdate(reply);
                Unit.SaveChanges();



                return Ok(reply);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
