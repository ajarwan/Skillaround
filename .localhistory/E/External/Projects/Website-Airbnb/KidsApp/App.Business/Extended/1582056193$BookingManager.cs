using App.Core;
using App.Core.Base;
using App.Data.Extended;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace App.Business.Extended
{
    public class BookingManager : BusinessBase<Booking>
    {
        #region "----Constructor----"
        public BookingManager(IUnitOfWork uw) : base(new BookingRepository(uw))
        {
        }
        public BookingRepository RepositoryBase
        {
            get
            {
                return ((BookingRepository)Repository);
            }
        }
        #endregion

        public override Booking AddUpdate(Booking entity, AddUpdateOptions options = null)
        {

            if (entity.State == BaseState.Added)
            {
                entity = base.AddUpdate(entity, options);
                Unit.SaveChanges();
                this.SendBookingNotificationEmail(entity);
                return entity;
            }
            else
            {
                return base.AddUpdate(entity, options);
            }




        }


        #region "----Helper----"
        public void SendBookingNotificationEmail(Booking entity)
        {

            var TemplatePath = Helper.GetTemplateLocationByName("InitialBookingNotificationUser.html");
            string text = System.IO.File.ReadAllText(TemplatePath);

            //Common
            text = text.Replace("{{SystemURL}}", ConfigurationManager.AppSettings["SystemBaseURL"].ToString());
            text = text.Replace("{{MailTo}}", ConfigurationManager.AppSettings["SupportEmail"].ToString());

            //Booking details
            text = text.Replace("{{Booking}}", entity.BookingNumber);
            text = text.Replace("{{Activity}}", entity.Activity.TitleEn);
            text = text.Replace("{{Location}}", entity.Activity.LocationName);
            text = text.Replace("{{Childs}}", entity.Count.ToString());
            text = text.Replace("{{Category}}", entity.Activity.Category.TitleEn);
            text = text.Replace("{{ProviderName}}", entity.Activity.Supplier.FullName);
            text = text.Replace("{{ProviderPhoneNumber}}", entity.Activity.Supplier.PhoneNumber);
 

            MailSender.SendEmail(App.Entity.Resources.KidsApp.WelcomEmailSubject, text, entity.User.Email);

        }

        #endregion
    }
}
