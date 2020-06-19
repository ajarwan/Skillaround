using App.Core;
using App.Core.Base;
using App.Data.Extended;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace App.Business.Extended
{
    class BookingManager : BusinessBase<Booking>
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
    }
}
