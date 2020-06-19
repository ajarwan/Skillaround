using App.Core;
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



                this.SendWelcomeMessage(entity.Email, entity.FullName);
                return entity;
            }
            else
            {
                return base.AddUpdate(entity, options);
            }


        }

        public void SendWelcomeMessage(string email, string fullName)
        {
            var welcomeURL = ConfigurationManager.AppSettings["WelcomeURL"];

            var TemplatePath = Path.Combine(Directory.GetCurrentDirectory(), @"AD\welcome.html");
        }
        #endregion
    }
}
