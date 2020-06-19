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
                Title = x.Title,
                Lat = x.Lat,
                Lng = x.Lng,
                Description = x.Description,
                Image = x.Category.ImageName, //x.Documents.Where(y => y.IsMain).Select(y => y.File).FirstOrDefault(),
                SupplierPhoneNumber = x.Supplier.PhoneNumber
            }).OrderBy(x => x.Id).Take(25).ToListAsync();


            return Results;

        }

        public int FindAvailableCapacityCount(int ActivityId)
        {
            return dbSet.Where(x => !x.IsDeleted && x.Id == ActivityId).Select(x => x.Capacity - x.Bookings.Where(y => y.IsDeleted).Count()).FirstOrDefault();

        }

    }
}
