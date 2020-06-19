﻿using App.Core;
using App.Core.Base;
using App.Data.Extended;
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
        public UserManager(IUnitOfWork uw) : base(new RepositoryBase<User>(uw))
        {
        }
        public RepositoryBase<User> RepositoryBase
        {
            get
            {
                return ((RepositoryBase<User>)Repository);
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
            else
            {
                return base.AddUpdate(entity, options);
            }


        }

        public void SendWelcomeMessage(User user)
        {
            var welcomeURL = ConfigurationManager.AppSettings["WelcomeURL"];

            //var path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);

            var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";
            //var b = Assembly.GetExecutingAssembly().Location;
            //var c = System.IO.Directory.GetCurrentDirectory();
            ////var d = Application.ExecutablePath;

            //path = path.Replace(@"file:\\", "");
            var TemplatePath = Path.Combine(path, @"AD\welcome.html");

            TemplatePath = TemplatePath.Replace(@"file:\\", "");
            string text = System.IO.File.ReadAllText(TemplatePath);
            text = text.Replace("{{WelcomeMsgTitle}}", App.Entity.Resources.KidsApp.WelcomEmailSubject);
            text = text.Replace("{{UserEmail}}", user.Email);
            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL".ToString()]);
            text = text.Replace("{{ActivateLink}}", ConfigurationManager.AppSettings["SystemBaseURL".ToString()] + "user/activate/" + user.UserUniqueId);
            text = text.Replace("{{ActivateYouAccount}}", App.Entity.Resources.KidsApp.ActivateYourAccount);
            
            MailSender.SendEmail("Welcome To Kids App", text, "alijarwan90@gmail.com");

        }
        #endregion
    }
}
