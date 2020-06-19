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
    public class ActivityRepository : RepositoryBase<Activity>
    {
        public ActivityRepository(IUnitOfWork uw) : base(uw)
        {

        }


        public PriceRange FindActivityPriceRange(Expression<Func<Activity, bool>> Filter)
        {
            var min = dbSet.Where(Filter).Select(x => (int?)x.Price).Min() ?? default(int);
            var max = dbSet.Where(Filter).Select(x => (int?)x.Price).Max() ?? default(int);

            if (max == 0)
                max = 1000;

            if (min == max)
                max += 1000;

            return new PriceRange() { MinPrice = min, MaxPrice = max };

        }

        public Task<List<ActivityMapMark>> FindAllMarks(Expression<Func<Activity, bool>> Filter)
        {

            var Q = dbSet.Where(Filter);

            var Results = Q.Select(x => new ActivityMapMark()
            {
                Id = x.Id,
                Title = UnitOfWork.Language == LanguageEnum.Arabic ? x.TitleAr : x.TitleEn,
                Lat = x.Lat,
                Lng = x.Lng,
                Description = UnitOfWork.Language == LanguageEnum.Arabic ? x.DescriptionAr : x.DescriptionEn,
                Image = x.Documents.Where(y => y.IsMain).Select(y => y.File).FirstOrDefault(),
                Pin = x.Category.ImageName,
                SupplierPhoneNumber = x.Supplier.PhoneNumber,
                Price = x.Price
            }).OrderBy(x => x.Id).Take(25).ToListAsync();


            return Results;

        }

        public bool CheckAvailability(int ActivityId, int count)
        {

            var Capacity = dbSet.Where(x => x.Id == ActivityId).Select(x => x.Capacity).FirstOrDefault();
            if (Capacity == 0)
            {
                return true;
            }
            else
            {
                var available = dbSet.Where(x => !x.IsDeleted && x.Id == ActivityId)
                    .Select(x => x.Capacity - (x.Bookings.Where(y => !y.IsDeleted && y.Status != Entity.SharedEnums.BookingConfirmationStatus.Cancelled)
                    .Select(y => y.Count).DefaultIfEmpty().Sum())).FirstOrDefault();

                if (available >= count)
                    return true;

                return false;


            }
        }

    }
}
