using App.Core;
using App.Core.Base;
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
    class BookingRepository : RepositoryBase<Booking>
    {
        public BookingRepository(IUnitOfWork uw) : base(uw)
        {

        }
    }
}
