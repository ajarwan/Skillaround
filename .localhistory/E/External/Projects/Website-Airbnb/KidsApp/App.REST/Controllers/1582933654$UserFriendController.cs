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

    [RoutePrefix("Api/UserFriend")]

    public class UserFriendController : BaseController
    {
        private readonly UserFriendsManager Mgr;

        public UserFriendController()
        {
            Mgr = new UserFriendsManager(Unit);
        }


        [Route("FindAllMyFriends")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllMyFriends(int pageIndex = 1, int pageSize = 12,
            string orderBy = "CreateDate DESC")
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex };

                Expression<Func<UserFriends, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => x.AcceptStatus == SharedEnums.AcceptStatus.Accepted);


                var UserIds = Mgr.FindUserFriendUserIds(Filter, this.ActiveUser.Id, orderBy);

                if (pager != null && pager.PageIndex > 0 && pager.PageSize > 0)
                {
                    pager.TotalRecords = UserIds.Count();
                    pager.TotalPages = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(pager.TotalRecords) / Convert.ToDouble(pager.PageSize)));

                    int skip = (pager.PageIndex - 1) * pager.PageSize;
                    UserIds = UserIds.Skip(skip).Take(pager.PageSize).ToList();

                }

                Manager<User> UserManager = new Manager<User>(Unit);

                var Users = await UserManager.FindAll_Async(x => UserIds.Contains(x.Id) && !x.IsDeleted, "", null, new List<string>());

                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(Users);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }


        [Route("RemoveFriend")]
        [HttpGet]
        [KidsAppAuthorization]
        public IHttpActionResult RemoveFriend(int userId)
        {
            try
            {
                Expression<Func<UserFriends, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => (x.UserId == this.ActiveUser.Id && x.FriendId == userId) ||
                (x.UserId == userId && x.FriendId == this.ActiveUser.Id));


                Mgr.DeleteBatch(Filter);
                Unit.SaveChanges();
                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }

        [Route("IsConnected")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> IsConnected(int userId)
        {
            try
            {
                if (userId == this.ActiveUser.Id)
                    return Ok(1);

                Expression<Func<UserFriends, bool>> Filter = x => !x.IsDeleted;

                Filter = Filter.And(x => (x.UserId == userId && x.FriendId == this.ActiveUser.Id) ||
                (x.UserId == this.ActiveUser.Id && x.FriendId == userId));


                var count = await Mgr.Count_Async(Filter);

                return Ok(count);
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
        public IHttpActionResult ConnectUsers(UserFriends userFriend)
        {
            try
            {
                //What abou double checking the relation if exisit already ? 

                userFriend.State = BaseState.Added;
                userFriend.AcceptStatus = SharedEnums.AcceptStatus.Pending;
                Mgr.AddUpdate(userFriend);

                Unit.SaveChanges();

                //Add System Notification
                Manager<Notification> NotMgr = new Manager<Notification>(Unit);
                Notification not = new Notification()
                {
                    State = BaseState.Added,
                    Type = SharedEnums.NotificationType.ConnectRequest,
                    FromUserId = this.ActiveUser.Id,
                    ToUserId = userFriend.FriendId,
                    TextAr = "طلب صداقة",
                    TextEn = "Connect Request",
                    UserFriendId = userFriend.Id
                };
                NotMgr.AddUpdate(not);

                Unit.SaveChanges();
                return Ok(userFriend);

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
        public IHttpActionResult UpdateUserFriends(UserFriends userFriend)
        {
            try
            {
                //What abou double checking the relation if exisit already ? 
                userFriend.State = BaseState.Modified;
                Mgr.AddUpdate(userFriend);

                if (userFriend.AcceptStatus == SharedEnums.AcceptStatus.Accepted)
                {
                    //Add System Notification
                    Manager<Notification> NotMgr = new Manager<Notification>(Unit);
                    Notification not = new Notification()
                    {
                        State = BaseState.Added,
                        Type = SharedEnums.NotificationType.ConnectRequest,
                        FromUserId = this.ActiveUser.Id,
                        ToUserId = userFriend.UserId,
                        TextAr = "موافقة على طلب الصداقة",
                        TextEn = "Connect Request Approval",
                        UserFriendId = userFriend.Id
                    };
                    NotMgr.AddUpdate(not);
                }
               
                Unit.SaveChanges();

                return Ok(userFriend);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());

                return InternalServerError(ex);
            }
        }


    }
}
