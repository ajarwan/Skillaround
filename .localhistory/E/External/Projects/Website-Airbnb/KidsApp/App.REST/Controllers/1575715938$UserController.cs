using App.Business;
using App.Business.Core;
using App.Core;
using App.Entity;
using App.Entity.Models;
using App.REST.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static App.Business.AppException;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/User")]
    public class UserController : BaseController
    {
        private readonly Manager<User> Mgr;
        public UserController()
        {
            Mgr = new Manager<User>(Unit);
        }

        [Route("IsExisit")]
        [HttpGet]
        public IHttpActionResult IsExisit(string email)
        {
            try
            {
                Expression<Func<User, bool>> Filter = x => !x.IsDeleted;
                email = email.ToLower().Trim();
                Filter = Filter.And(x => x.Email.ToLower().Trim() == email);

                var count = Mgr.Count(Filter);

                if (count > 0)
                    return Ok(true);

                return Ok(false);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("FindAll")]
        [HttpGet]
        public async Task<IHttpActionResult> FindAllUsers()
        {
            try
            {
                Pager pager = new Pager() { PageSize = 10, PageIndex = 1 }; ;


                Expression<Func<User, bool>> Filter = x => !x.IsDeleted;

                var users = await Mgr.FindAll_Async(Filter, "Id", pager, null);


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(users);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("Signup")]
        [HttpPost]
        public IHttpActionResult Signup(User user)
        {
            try
            {

                user.Email = user.Email.ToLower();

                //For System Provider
                if (user.LoginProvider == SharedEnums.LoginProvider.System)
                {
                    if (Mgr.Count(x => x.Email.ToLower() == user.Email) > 0)
                    {
                        throw new AppException(BusinessErrorCodes.UserExisit);
                    }
                }

                //For Google Provider
                if (user.LoginProvider == SharedEnums.LoginProvider.Google)
                {
                    if (Mgr.Count(x => x.Email.ToLower() == user.Email && x.LoginProvider == SharedEnums.LoginProvider.Google) > 0)
                    {
                        return this.Login(user.Email, ConfigurationManager.AppSettings["SocialUsersKey"]);
                        //user = Mgr.FindAll((x) => x.Email.ToLower() == user.Email).FirstOrDefault();
                        //return Ok(user);
                        //throw new AppException(BusinessErrorCodes.UserExisit);
                    }
                    else if (Mgr.Count(x => x.Email.ToLower() == user.Email) > 0)
                    {
                        throw new AppException(BusinessErrorCodes.UserExisit);
                    }
                }

                //For FB Provider
                if (user.LoginProvider == SharedEnums.LoginProvider.Facebook)
                {
                    if (Mgr.Count(x => x.Email.ToLower() == user.Email && x.LoginProvider == SharedEnums.LoginProvider.Facebook) > 0)
                    {
                        return this.Login(user.Email, ConfigurationManager.AppSettings["SocialUsersKey"]);
                        //user = Mgr.FindAll((x) => x.Email.ToLower() == user.Email).FirstOrDefault();
                        //return Ok(user);
                        //throw new AppException(BusinessErrorCodes.UserExisit);
                    }
                    else if (Mgr.Count(x => x.Email.ToLower() == user.Email) > 0)
                    {
                        throw new AppException(BusinessErrorCodes.UserExisit);
                    }
                }


                if (user.LoginProvider != SharedEnums.LoginProvider.System)
                    user.PasswordHash = ConfigurationManager.AppSettings["SocialUsersKey"];

                user.PasswordHash = Helper.EncryptHash(user.PasswordHash, ConfigurationManager.AppSettings["EnToken"]);

                user.State = BaseState.Added;
                //TODO
                //user.PasswordHash = 
                Mgr.AddUpdate(user);
                Unit.SaveChanges();
                return Ok(user);
            }
            catch (AppException appex)
            {
                return Content(HttpStatusCode.ExpectationFailed, appex.GetErroResponse());
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        //[authorize]
        [Route("Update")]
        [HttpPut]
        public IHttpActionResult Update(User user)
        {
            try
            {
                user.State = BaseState.Modified;
                //user.PasswordHash = 
                Mgr.AddUpdate(user);
                Unit.SaveChanges();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("ChangePassword")]
        [HttpPut]
        public IHttpActionResult ChangePassword(string newPassword)
        {
            try
            {
                //user.State = BaseState.Modified;
                ////user.PasswordHash = 
                //Mgr.AddUpdate(user);
                //Unit.SaveChanges();
                //return Ok(user);
                return null;
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("Login")]
        [HttpPut]
        public IHttpActionResult Login(string email, string password)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                {
                    return Unauthorized();
                }

                password = Helper.EncryptHash(password, ConfigurationManager.AppSettings["EnToken"]);
                email = email.ToLower();

                var user = Mgr.FindAll(x => x.Email.ToLower() == email && x.PasswordHash == password).FirstOrDefault();

                if (user == null)
                    return Unauthorized();

                user.PasswordHash = '';
                var auth = new
                {
                    user = user,
                    token = AuthManager.GenerateToken(user)
                };
                return Ok(auth);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


    }
}
