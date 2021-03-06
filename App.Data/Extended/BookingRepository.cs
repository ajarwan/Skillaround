﻿using App.Core;
using App.Core.Base;
using App.Entity;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class BookingRepository : RepositoryBase<Booking>
    {
        public BookingRepository(IUnitOfWork uw) : base(uw)
        {

        }

        public BookingStatisticsDTO FindActivityBookingStatistics(int ActivityId)
        {

            BookingStatisticsDTO stat = new BookingStatisticsDTO();

            stat.TotalBooking = dbSet.Where(x=>x.ActivityId == ActivityId).Count(x => !x.IsDeleted);
            stat.PendingCount = dbSet.Where(x => x.ActivityId == ActivityId).Count(x => !x.IsDeleted && x.Status == SharedEnums.BookingConfirmationStatus.Pending);
            stat.CancelledCount = dbSet.Where(x => x.ActivityId == ActivityId).Count(x => !x.IsDeleted && x.Status == SharedEnums.BookingConfirmationStatus.Cancelled);
            stat.ConfirmedCount = dbSet.Where(x => x.ActivityId == ActivityId).Count(x => !x.IsDeleted && x.Status == SharedEnums.BookingConfirmationStatus.Confirmed);
            return stat;

             
        }
    }
}
