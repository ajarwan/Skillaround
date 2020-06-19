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
    [RoutePrefix("Api/Booking")]
    public class BookingController : BaseController
    {
        private readonly BookingManager Mgr;
        public BookingController()
        {
            Mgr = new BookingManager(Unit);
        }


        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult AddBooking(Booking booking)
        {
            try
            {
                ActivityManager ActMgr = new ActivityManager(Unit);

                if (ActMgr.CheckAvailability(booking.ActivityId, booking.Count))
                {
                    booking.State = BaseState.Added;
                    Mgr.AddUpdate(booking);
                    Unit.SaveChanges();
                    return Ok(booking);
                }
                else
                {
                    return Ok(false);
                }


            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllBookings(string bookingNumber = null,int? supplierId = null, int pageIndex = 1, int pageSize = 10,
            string include = null, string orderBy = "CreateDate DESC")
        {
            try
            {
                ActivityManager ActMgr = new ActivityManager(Unit);

                if (ActMgr.CheckAvailability(booking.ActivityId, booking.Count))
                {
                    booking.State = BaseState.Added;
                    Mgr.AddUpdate(booking);
                    Unit.SaveChanges();
                    return Ok(booking);
                }
                else
                {
                    return Ok(false);
                }


            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


    }
}
