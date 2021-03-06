﻿using App.Business;
using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IO;
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
                    var sender = UserManager.FindById(MessagingQueue.FromUserId);
                    SendUserCommunicationEmail(sender.FullName, MessagingQueue.Message, email);
                }


                if (MessagingQueue.MessageType == SharedEnums.MessageType.SystemMessgae)
                {
                    Manager<Notification> NotMgr = new Manager<Notification>(Unit);
                    Notification not = new Notification()
                    {
                        State = BaseState.Added,
                        ToUserId = MessagingQueue.ToUserId,
                        FromUserId = MessagingQueue.FromUserId,
                        TextAr = MessagingQueue.Message,
                        TextEn = MessagingQueue.Message,
                        Type = SharedEnums.NotificationType.UserMessage,
                        MessagingQueueId = MessagingQueue.Id
                    };
                    NotMgr.AddUpdate(not);
                    Unit.SaveChanges();
                }



                return Ok(MessagingQueue);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        public void SendUserCommunicationEmail(string senderFullName, string msgBody, string to)
        {

            var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";
            var TemplatePath = Path.Combine(path, @"AD\UsersEmailCommunication.html");

            TemplatePath = TemplatePath.Replace(@"file:\\", "");

            string text = System.IO.File.ReadAllText(TemplatePath);

            text = text.Replace("{{UserSentYouAmessageSubject}}", senderFullName);
            text = text.Replace("{{UserSentYouAmessageTitle}}", senderFullName + " " + App.Entity.Resources.KidsApp.SentYouEmail);
            text = text.Replace("{{MsgBody}}", msgBody);


            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());
            text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());
            text = text.Replace("{{EmailAboutBody}}", App.Entity.Resources.KidsApp.AboutEmailBody);



            MailSender.SendEmail(App.Entity.Resources.KidsApp.SentYouEmailSubject, text, to);



        }
    }
}
