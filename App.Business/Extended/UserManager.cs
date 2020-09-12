using App.Core;
using App.Core.Base;
using App.Data.Extended;
using App.Entity;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;


namespace App.Business.Extended
{
    public class UserManager : BusinessBase<User>
    {
        #region "----Constructor----"
        public UserManager(IUnitOfWork uw) : base(new UserRepository(uw))
        {
        }
        public UserRepository RepositoryBase
        {
            get
            {
                return ((UserRepository)Repository);

            }
        }
        #endregion

        #region "----Constructor----"

        public override User AddUpdate(User entity, AddUpdateOptions options = null)
        {

            if (entity.State == BaseState.Added)
            {
                //Send Welcome Email
                entity.UserUniqueId = new Guid();

                entity = base.AddUpdate(entity, options);
                entity.UserUniqueId = Guid.NewGuid();
                Unit.SaveChanges();
                this.SendWelcomeMessage(entity);

                return entity;
            }
            else if (entity.State == BaseState.Modified)
            {
                entity.PasswordHash = this.FindById(entity.Id).PasswordHash;
                return base.AddUpdate(entity, options);
            }
            else
            {
                return base.AddUpdate(entity, options);
            }


        }

        public void SendWelcomeMessage(User user)
        {

            //TODO:
            //Handle For Supplier Msg Template
            //WelcomSupplierMailTemplate.html

            var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";
            var TemplatePath = "";
            if (user.IsSupplier)
            {
                TemplatePath = Path.Combine(path, @"AD\WelcomSupplierMailTemplate.html");
            }
            else
            {
                TemplatePath = Path.Combine(path, @"AD\WelcomMailTemplate.html");
            }

            TemplatePath = TemplatePath.Replace(@"file:\\", "");

            string text = System.IO.File.ReadAllText(TemplatePath);

            text = text.Replace("{{WelcomEmailSubject}}", App.Entity.Resources.KidsApp.WelcomEmailSubject);
            text = text.Replace("{{WelcomeEmailTitle}}", App.Entity.Resources.KidsApp.WelcomEmailSubject);
            text = text.Replace("{{YouUserNameIs}}", App.Entity.Resources.KidsApp.YouUserNameIs);
            text = text.Replace("{{UserEmail}}", user.Email);
            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());


            text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());
            text = text.Replace("{{EmailAboutBody}}", App.Entity.Resources.KidsApp.AboutEmailBody);

            if (user.IsSupplier)
            {
                text = text.Replace("{{WelcomeEmailSubTitle}}", App.Entity.Resources.KidsApp.WelcomeEmailSupplierSubTitle);
                text = text.Replace("{{ActivateYouAccount}}", App.Entity.Resources.KidsApp.GoToMyPortal);
                text = text.Replace("{{ActivateLink}}", (ConfigurationManager.AppSettings["SupplierPortalURL"].ToString()));
            }
            else
            {
                text = text.Replace("{{WelcomeEmailSubTitle}}", App.Entity.Resources.KidsApp.WelcomeEmailSubTitle);
                text = text.Replace("{{ActivateYouAccount}}", App.Entity.Resources.KidsApp.ActivateYourAccount);
                text = text.Replace("{{ActivateLink}}", (ConfigurationManager.AppSettings["AccountActivateURL"].ToString()).Replace("{{guid}}", user.UserUniqueId.ToString()));
            }

            //MailSender.SendEmail(App.Entity.Resources.KidsApp.WelcomEmailSubject, text, "alijarwan90@gmail.com");

            MailSender.SendEmail(App.Entity.Resources.KidsApp.WelcomEmailSubject, text, user.Email);

        }

        public void SendResetPasswordEmail(User user)
        {

            //var path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);

            var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";
            //var b = Assembly.GetExecutingAssembly().Location;
            //var c = System.IO.Directory.GetCurrentDirectory();
            ////var d = Application.ExecutablePath;

            //path = path.Replace(@"file:\\", "");
            var TemplatePath = Path.Combine(path, @"AD\ForgetPasswordMailTemplate.html");

            TemplatePath = TemplatePath.Replace(@"file:\\", "");
            string text = System.IO.File.ReadAllText(TemplatePath);
            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());
            text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());

            text = text.Replace("{{ResetPasswordSubject}}", App.Entity.Resources.KidsApp.ResetPasswordSubject);
            text = text.Replace("{{HiUser}}", App.Entity.Resources.KidsApp.Hi + " " + user.FullName);
            text = text.Replace("{{ResetPasswordEmailHeader}}", App.Entity.Resources.KidsApp.ResetPasswordEmailHeader);
            text = text.Replace("{{SetNewPassword}}", App.Entity.Resources.KidsApp.SetNewPassword);
            text = text.Replace("{{SetNewPasswordLink}}", ConfigurationManager.AppSettings["ResetURL"].ToString().Replace("{{guid}}", user.UserUniqueId.ToString()));


            //MailSender.SendEmail(App.Entity.Resources.KidsApp.ResetPasswordSubject, text, "alijarwan90@gmail.com");
            MailSender.SendEmail(App.Entity.Resources.KidsApp.ResetPasswordSubject, text, user.Email);

        }

        public User RegisterSupplier(User user, string password)
        {
            if (user.Id > 0)
            {
                //Update Status
                user.State = BaseState.Modified;
                user = this.AddUpdate(user);
                this.SendWelcomeMessage(user);

                if (user.Documents.Any(x => x.DocumentType == Entity.SharedEnums.DocumentType.PersonalPhoto))
                {
                    user.Image = user.Documents.FirstOrDefault(x => x.DocumentType == Entity.SharedEnums.DocumentType.PersonalPhoto).File;
                }
                return user;
            }
            else
            {
                //We Need to add a new user
                if (user.Documents.Any(x => x.DocumentType == Entity.SharedEnums.DocumentType.PersonalPhoto))
                {
                    user.Image = user.Documents.FirstOrDefault(x => x.DocumentType == Entity.SharedEnums.DocumentType.PersonalPhoto).File;
                }
                user.PasswordHash = Helper.EncryptHash(password, ConfigurationManager.AppSettings["EnToken"]);
                user.State = BaseState.Added;
                return this.AddUpdate(user);
            }


        }

        public List<string> GetUserEmails(SharedEnums.MailReceiverType type)
        {
            return RepositoryBase.GetUserEmails(type);
        }

        public bool CheckUserActive(int userId)
        {
            return RepositoryBase.CheckUserActive(userId);
        }
        #endregion
    }
}

