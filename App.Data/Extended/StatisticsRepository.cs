﻿using App.Core;
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
    public class StatisticsRepository : RepositoryBase<Statistic>
    {
        #region "----Constructor----"
        public StatisticsRepository(IUnitOfWork uw) : base(uw)
        {

        }
        #endregion "----Constructor----"

        #region "----Extended----"

        public async Task<SupplierActivityViewStatistics> FindSupplierActivityViewStatistics(int activityId)
        {
            var res = new SupplierActivityViewStatistics()
            {
                ActivityId = activityId
            };


            Expression<Func<Statistic, bool>> FilterListUser = x => !x.IsDeleted && x.ActivityId == activityId && x.UserId.HasValue && x.Type == Entity.SharedEnums.StatisicType.ActivityViewList;
            Expression<Func<Statistic, bool>> FilterListAnonymous = x => !x.IsDeleted && x.ActivityId == activityId && !x.UserId.HasValue && x.Type == Entity.SharedEnums.StatisicType.ActivityViewList;
            Expression<Func<Statistic, bool>> FilterDetailsUser = x => !x.IsDeleted && x.ActivityId == activityId && x.UserId.HasValue && x.Type == Entity.SharedEnums.StatisicType.ActivityView;
            Expression<Func<Statistic, bool>> FilterDetailsAnonymous = x => !x.IsDeleted && x.ActivityId == activityId && !x.UserId.HasValue && x.Type == Entity.SharedEnums.StatisicType.ActivityView;

            res.SystemUsersViewCount_List = await this.Count_Async(FilterListUser);
            res.AnonymousUsersViewCount_List = await this.Count_Async(FilterListAnonymous);
            res.SystemUsersViewCount_Details = await this.Count_Async(FilterDetailsUser);
            res.AnonymousUsersViewCount_Details = await this.Count_Async(FilterDetailsAnonymous);


            return res;

        }


        public async Task<List<UserDTO>> FindMostActiveUsers()
        {


            Expression<Func<Statistic, bool>> Filter = x => !x.IsDeleted;

            Filter = Filter.And(x => x.Type == Entity.SharedEnums.StatisicType.UserAccess);

            Filter = Filter.And(x => x.User.UserType == Entity.SharedEnums.UserTypes.Normal);

            Filter = Filter.And(x => !x.User.IsDeleted);

            var Query = dbSet.AsNoTracking().Where(Filter);

            var res = await Query.OrderByDescending(x => x.CreateDate).GroupBy(x => x.UserId).OrderByDescending(x => x.Count()).Select(x => x.FirstOrDefault()).Select(x => new UserDTO()
            {
                CreateDate = x.CreateDate,
                Email = x.User.Email,
                Image = x.User.Image,
                FirstName = x.User.FirstName,
                LastName = x.User.LastName
            }).Take(5).ToListAsync();

            return res;

        }


        public async Task<List<MostViewedActivity>> FindMostViewedActivities()
        {


            Expression<Func<Statistic, bool>> Filter = x => !x.IsDeleted;

            Filter = Filter.And(x => x.Type == Entity.SharedEnums.StatisicType.ActivityView || x.Type == Entity.SharedEnums.StatisicType.ActivityViewList);

            var Query = dbSet.AsNoTracking().Where(Filter);

            var res = await Query.OrderByDescending(x => x.Type).GroupBy(x => x.ActivityId)
                .OrderByDescending(x => x.Count())
                .Select(x => new MostViewedActivity()
                {
                    Activity = new
                    {
                        TitleAr = x.FirstOrDefault().Activity.TitleAr,
                        TitleEn = x.FirstOrDefault().Activity.TitleEn,
                        Category = x.FirstOrDefault().Activity.Category,
                        From = x.FirstOrDefault().Activity.From,
                        To = x.FirstOrDefault().Activity.To,
                        LocationName = x.FirstOrDefault().Activity.AtUserLocation ? App.Entity.Resources.KidsApp.AtUserLocation : (x.FirstOrDefault().Activity.OnlineLocation ? App.Entity.Resources.KidsApp.OnlineLocation : x.FirstOrDefault().Activity.LocationName),
                        Title = UnitOfWork.Language == LanguageEnum.Arabic ? x.FirstOrDefault().Activity.TitleAr : x.FirstOrDefault().Activity.TitleEn
                    },
                    Count = x.Count()
                })
                 .Take(6).ToListAsync();

            return res;

        }
        #endregion "----Extended----"
    }
}
