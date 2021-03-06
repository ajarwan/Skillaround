﻿using App.Core;
using App.Core.Base;
using App.Entity.DTO;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class ReviewRepository : RepositoryBase<Review>
    {
        public ReviewRepository(IUnitOfWork uw) : base(uw)
        {

        }


        public decimal FindActivityTotalRate(Expression<Func<Review, bool>> Filter)
        {
            return dbSet.Where(Filter).Select(x => x.Rate).Sum();
        }


        public List<MostRatedSuppliersDTO> FindMostRatedSuppliersIds()
        {
            var Query = dbSet.AsNoTracking().AsQueryable();

            var results = Query.Where(x => !x.IsDeleted).GroupBy(x => x.Activity.SupplierId).Select(x =>
              new MostRatedSuppliersDTO
              {
                  UserId = x.FirstOrDefault().Activity.Supplier.Id,
                  TotalRatesSum = x.Sum(y => y.Rate),
                  Count = x.Count(),
                  FullName = x.FirstOrDefault().Activity.Supplier.FirstName + " " + x.FirstOrDefault().Activity.Supplier.LastName,
                  Image = x.FirstOrDefault().Activity.Supplier.Image,
                  Email = x.FirstOrDefault().Activity.Supplier.Email,
                  AvgRate = Math.Round(x.Sum(y => y.Rate) / (decimal)(x.Count()), 2),
                  UserType = x.FirstOrDefault().Activity.Supplier.UserType
              }).OrderBy(x => x.TotalRatesSum).Take(5).ToList();

            return results;
        }

    }


}
