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


        [Route("FindAll")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllBookings(string bookingNumber = null, int? activityId = null, int pageIndex = 1, int pageSize = 10,
            string include = null, string orderBy = "CreateDate DESC", int? supplierId = null,
            string bookingUserName = null, string bookingUserEmail = null,
            SharedEnums.BookingConfirmationStatus bookingStatusId = SharedEnums.BookingConfirmationStatus.All)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex };

                Expression<Func<Booking, bool>> Filter = x => !x.IsDeleted;

                if (!string.IsNullOrWhiteSpace(bookingNumber))
                {
                    bookingNumber = bookingNumber.ToLower().Trim();
                    Filter = Filter.And(x => x.BookingNumber.ToLower().Trim().Contains(bookingNumber));
                }

                if (activityId.HasValue)
                {
                    Filter = Filter.And(x => x.ActivityId == activityId.Value);
                }

                if (supplierId.HasValue)
                {
                    Filter = Filter.And(x => x.Activity.SupplierId == supplierId.Value);
                }
                if (!string.IsNullOrEmpty(bookingUserName))
                {
                    bookingUserName = bookingUserName.ToLower();
                    Filter = Filter.And(x => !x.IsDeleted && ((x.User.FirstName + " " + x.User.LastName).ToLower().Contains(bookingUserName)));
                }

                if (!string.IsNullOrEmpty(bookingUserEmail))
                {
                    bookingUserEmail = bookingUserEmail.ToLower();
                    Filter = Filter.And(x => x.User.Email.ToLower().Contains(bookingUserEmail));
                }

                if (bookingStatusId != SharedEnums.BookingConfirmationStatus.All)
                {

                    Filter = Filter.And(x => x.Status == bookingStatusId);
                }

                var bookings = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(bookings);


            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPut]
        [KidsAppAuthorization]
        public IHttpActionResult UpdateBooking(Booking booking)
        {
            try
            {
                //So Far, Booking Can Be Updated Only By Supplier
                booking.State = BaseState.Modified;
                Mgr.AddUpdate(booking);


                Manager<Notification> NotMgr = new Manager<Notification>(Unit);
                Notification not = new Notification()
                {
                    FromUserId = this.ActiveUser.Id,
                    ToUserId = booking.UserId,
                    TextAr = booking.Status == SharedEnums.BookingConfirmationStatus.Confirmed ? "Booking Confirmed" : "Booking Canceled",
                    TextEn = booking.Status == SharedEnums.BookingConfirmationStatus.Confirmed ? "Booking Confirmed" : "Booking Canceled",
                    Type = SharedEnums.NotificationType.Booking,
                    RelatedBookingId = booking.Id
                };
                NotMgr.AddUpdate(not);




                Unit.SaveChanges();

                return Ok(booking);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("FindAllBookingsStatistics")]
        [HttpGet]
        [KidsAppAuthorization]
        public IHttpActionResult FindAllBookingsStatistics(int activityId)
        {
            try
            {
                return Ok(Mgr.FindActivityBookingStatistics(activityId));
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }



    }
}
