using App.Business;
using App.Business.Core;
using App.Business.Extended;
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
        private readonly UserManager Mgr;
        public UserController()
        {
            Mgr = new UserManager(Unit);
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
        public IHttpActionResult Signup(User user, string password = null)
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
                else
                    user.PasswordHash = Helper.EncryptHash(password, ConfigurationManager.AppSettings["EnToken"]);

                user.State = BaseState.Added;

                Mgr.AddUpdate(user);
                Unit.SaveChanges();

                return Login(user.Email, user.LoginProvider == SharedEnums.LoginProvider.System ? password : ConfigurationManager.AppSettings["SocialUsersKey"]);
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
        [HttpGet]
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
                else
                {
                    user.PasswordStatus = SharedEnums.UserPasswordStatus.Set;
                    user.State = BaseState.Modified;
                    Unit.SaveChanges();
                }

                user.PasswordHash = "";
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

        [Route("Details")]
        [HttpGet]
        [KidsAppAuthorization]
        public IHttpActionResult GetDetails()
        {
            try
            {

                User u = this.Mgr.FindById(this.ActiveUser.Id);

                return Ok(u);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("CheckEmail")]
        [HttpGet]
        public IHttpActionResult CheckEmail(string email)
        {
            try
            {

                email = email.ToLower();
                if (Mgr.Count(x => x.Email.ToLower() == email) > 0)
                {
                    return Ok(false);
                }

                return Ok(true);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [Route("ForgetPassword")]
        [HttpGet]
        public IHttpActionResult ForgetPassword(string email)
        {
            try
            {

                email = email.ToLower();
                var user = Mgr.FindAll(x => x.Email.ToLower() == email && !x.IsDeleted).FirstOrDefault();

                if (user == null)
                {
                    return Ok(false);
                }

                user.UserUniqueId = Guid.NewGuid();
                user.PasswordStatus = SharedEnums.UserPasswordStatus.Reset;
                user.State = BaseState.Modified;
                Mgr.AddUpdate(user);
                Unit.SaveChanges();
                //send email with the link;
                Mgr.SendResetPasswordEmail(user);
                //var URL = ConfigurationManager.AppSettings["ResetURL"].ToString().Replace("{{guid}}", user.UserUniqueId.ToString());
                //MailSender.SendEmail(Entity.Resources.KidsApp.EmailResetPasswodSubject, URL, user.Email);



                return Ok(true);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("FindUserByUniqueId")]
        [HttpGet]
        public async Task<IHttpActionResult> FindUserByUniqueId(string uniqueId)
        {
            try
            {

                uniqueId = uniqueId.ToLower();
                var users = await Mgr.FindAll_Async(x => x.UserUniqueId.ToString().ToLower() == uniqueId && !x.IsDeleted && x.PasswordStatus == SharedEnums.UserPasswordStatus.Reset, "", null, new List<string>() { });

                var user = users.FirstOrDefault();

                return Ok(user);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("ResetPassword")]
        [HttpGet]
        public async Task<IHttpActionResult> ResetPassword(string uniqueId, string password)
        {
            try
            {

                uniqueId = uniqueId.ToLower();
                var users = await Mgr.FindAll_Async(x => x.UserUniqueId.ToString().ToLower() == uniqueId && !x.IsDeleted && x.PasswordStatus == SharedEnums.UserPasswordStatus.Reset, "", null, new List<string>() { });

                var user = users.FirstOrDefault();

                user.PasswordHash = Helper.EncryptHash(password, ConfigurationManager.AppSettings["EnToken"]);
                user.UserUniqueId = null;
                user.PasswordStatus = SharedEnums.UserPasswordStatus.Reset;
                user.State = BaseState.Modified;
                Mgr.AddUpdate(user);
                Unit.SaveChanges();
                return Ok(user);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [Route("ActivateUser")]
        [HttpGet]
        public async Task<IHttpActionResult> ActivateUser(string uniqueId)
        {
            try
            {

                uniqueId = uniqueId.ToLower();
                var users = await Mgr.FindAll_Async(x => x.UserUniqueId.ToString().ToLower() == uniqueId && !x.IsDeleted && !x.IsAccountActivated, "", null, new List<string>() { });


                var user = users.FirstOrDefault();

                if (user != null)
                {
                    user.IsAccountActivated = true;
                    user.UserUniqueId = null;
                    user.State = BaseState.Modified;
                    Mgr.AddUpdate(user);
                    Unit.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
