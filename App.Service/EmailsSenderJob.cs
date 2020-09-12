using App.Business;
using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
namespace App.Service
{
    public class EmailsSenderJob
    {

        public void StartSending(object sender, System.Timers.ElapsedEventArgs e)
        {
            using (UnitOfWork Unit = UOW.GetInstanceForJobs())
            {
                Unit.LogError(new Exception(" StartSending Start"));
                UserManager UserMgr = new UserManager(Unit);
                Manager<OutgoingEmail> Mgr = new Manager<OutgoingEmail>(Unit);
                Expression<Func<OutgoingEmail, bool>> Filter = x => !x.IsDeleted && !x.IsProcessing;
                List<OutgoingEmail> OutGoingMails = Mgr.FindAll(Filter, "Id", null, null);

                //Set IsProcessing To True
                OutGoingMails.ForEach((outGoingMail) =>
                {
                    outGoingMail.State = BaseState.Modified;
                    outGoingMail.IsProcessing = true;
                });

                Mgr.AddUpdate(OutGoingMails);
                Unit.SaveChanges();

                foreach (OutgoingEmail outgoingEmail in OutGoingMails)
                {
                    try
                    {
                        var EmailBody = this.GetEmailTemplateBody(outgoingEmail);
                        List<string> EmailsList = UserMgr.GetUserEmails(outgoingEmail.MailReceiverType);
                        //MailSender.SendEmail(outgoingEmail.Subject, EmailBody, user.Email);
                        foreach (var email in EmailsList)
                        {
                            try
                            {
                                MailSender.SendEmail(outgoingEmail.Subject, EmailBody, email);

                            }
                            catch (Exception ex)
                            {
                                Unit.LogError(new Exception("Error Send Email Id: " + outgoingEmail.Id + " ----- To:" + email));
                                Unit.LogError(ex);
                            }
                        }
                        outgoingEmail.State = BaseState.Modified;
                        outgoingEmail.IsSuccess = true;
                        Mgr.AddUpdate(outgoingEmail);
                        Unit.SaveChanges();
                    }
                    catch (Exception ex2)
                    {
                        Unit.LogError(new Exception("Error Send Email Id: " + outgoingEmail.Id));
                        Unit.LogError(ex2);
                        throw;
                    }
                }
            }
        }


        public string GetEmailTemplateBody(OutgoingEmail outgoingEmail)
        {
            //var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";

            //TemplatePath = Path.Combine(path, @"AD\EmailTemplate.html");

            //TemplatePath = TemplatePath.Replace(@"file:\\", "");

            var TemplatePath = ConfigurationManager.AppSettings["EmailTemplatePath"];
            string text = System.IO.File.ReadAllText(TemplatePath);

            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());
            text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());
            text = text.Replace("{{EmailAboutBody}}", App.Entity.Resources.KidsApp.AboutEmailBody);

            //Email Body
            text = text.Replace("{{MsgBodyEn}}", outgoingEmail.TextEn);
            text = text.Replace("{{MsgBodyAr}}", outgoingEmail.TextAr);

            return text;
            //MailSender.SendEmail(App.Entity.Resources.KidsApp.WelcomEmailSubject, text, "alijarwan90@gmail.com");
        }
    }
}

