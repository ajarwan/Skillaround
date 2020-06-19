using App.Business;
using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.DTO;
using App.Entity.DTO.Payment;
using App.Entity.Models;
using App.REST.Common;
using Newtonsoft.Json;
using RestSharp;
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("FindAll")]
        [HttpGet]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> FindAllUsers(string keyword = null, string types = null,
             int pageIndex = 1, int pageSize = 10, string include = null, string orderBy = "CreateDate DESC", int? exclude = null, bool searchForConnect = false)
        {
            try
            {
                Pager pager = new Pager() { PageSize = pageSize, PageIndex = pageIndex }; ;


                Expression<Func<User, bool>> Filter = x => !x.IsDeleted;

                if (!string.IsNullOrEmpty(keyword))
                {
                    keyword = keyword.ToLower().Trim();
                    Filter = Filter.And(x => x.Email.ToLower().Trim().Contains(keyword) || x.FirstName.ToLower().Trim().Contains(keyword) ||
                    x.LastName.ToLower().Trim().Contains(keyword) || (x.FirstName.ToLower().Trim() + " " + x.LastName.ToLower().Trim()).Contains(keyword));

                }

                if (!string.IsNullOrEmpty(types))
                {
                    var Types = Helper.ToIntArray(types).Select(x => (SharedEnums.UserTypes)x).ToList();
                    Filter = Filter.And(x => Types.Contains(x.UserType));
                }

                if (exclude.HasValue)
                {
                    Filter = Filter.And(x => x.Id != exclude.Value);
                }

                if (searchForConnect)
                {
                    Filter = Filter.And(x => x.Id != this.ActiveUser.Id);
                    Filter = Filter.And(x => x.UserType != SharedEnums.UserTypes.Manager);
                    Filter = Filter.And(x => !x.Friends.Any(y => !y.IsDeleted && y.FriendId == this.ActiveUser.Id));
                    Filter = Filter.And(x => !x.RelatedFriends.Any(y => !y.IsDeleted && y.UserId == this.ActiveUser.Id));

                }

                var users = await Mgr.FindAll_Async(Filter, orderBy, pager, Helper.ToStringArray(include));


                HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Pager");

                HttpContext.Current.Response.Headers.Add("X-Pager",
                   Newtonsoft.Json.JsonConvert.SerializeObject(pager));

                return Ok(users);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                    user.PasswordHash = Helper.EncryptHash(ConfigurationManager.AppSettings["SocialUsersKey"], ConfigurationManager.AppSettings["EnToken"]);
                else
                    user.PasswordHash = Helper.EncryptHash(password, ConfigurationManager.AppSettings["EnToken"]);

                user.State = BaseState.Added;

                Mgr.AddUpdate(user);
                Unit.SaveChanges();

                return Login(user.Email, user.LoginProvider == SharedEnums.LoginProvider.System ? password : ConfigurationManager.AppSettings["SocialUsersKey"], true);
            }
            catch (AppException appex)
            {
                Unit.LogError(appex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return Content(HttpStatusCode.ExpectationFailed, appex.GetErroResponse());
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [KidsAppAuthorization]
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        [Route("UpdateSupplier")]
        [KidsAppAuthorization]
        [HttpPut]
        public IHttpActionResult UpdateSupplierInfo(User user)
        {
            try
            {

                var entity = Mgr.FindById(user.Id);

                entity.FirstName = user.FirstName;
                entity.LastName = user.LastName;
                entity.Gender = user.Gender;
                entity.PhoneNumber = user.PhoneNumber;
                //entity.SupplierStatrtWorkingDay = user.SupplierStatrtWorkingDay;
                //entity.SupplierEndWorkingDay = user.SupplierEndWorkingDay;
                //entity.StartWorkingTime = user.StartWorkingTime;
                //entity.EndWorkingTime = user.EndWorkingTime;
                entity.Image = user.Image;
                entity.State = BaseState.Modified;
                //user.PasswordHash = 
                entity.YearOfEstablishment = user.YearOfEstablishment;
                entity.LicenseExpiryDate = user.LicenseExpiryDate;
                entity.LicenseNumber = user.LicenseNumber;
                entity.Location = user.Location;

                entity.WorkingDays = user.WorkingDays;
                Mgr.AddUpdate(entity);
                Unit.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("Login")]
        [HttpGet]
        public IHttpActionResult Login(string email, string password, bool isNewUser = false)
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
                    token = AuthManager.GenerateToken(user),
                    isNewUser = isNewUser
                };
                return Ok(auth);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("Details")]
        [HttpGet]
        [KidsAppAuthorization]
        public IHttpActionResult GetUserDetails(string include)
        {
            try
            {
                var includes = Helper.ToStringArray(include);

                User u = this.Mgr.FindById(this.ActiveUser.Id, includes);

                return Ok(u);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("DetailsDTO")]
        [HttpGet]
        [KidsAppAuthorization]
        public IHttpActionResult GetActiveUserDetailsDTO()
        {
            try
            {

                User u = this.Mgr.FindById(this.ActiveUser.Id);

                UserDTO dto = new UserDTO()
                {
                    Email = u.Email,
                    Image = u.Image,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Gender = u.Gender,
                    DOB = u.DOB,
                    PhoneNumber = u.PhoneNumber
                };



                return Ok(dto);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("DetailsDTO")]
        [HttpPut]
        [KidsAppAuthorization]
        public IHttpActionResult UpdateUserDTO(UserDTO userDTO)
        {
            try
            {
                User u = this.Mgr.FindById(this.ActiveUser.Id);

                u.Image = userDTO.Image;
                u.FirstName = userDTO.FirstName;
                u.LastName = userDTO.LastName;
                u.Gender = userDTO.Gender;
                u.DOB = userDTO.DOB;
                u.PhoneNumber = userDTO.PhoneNumber;

                u.State = BaseState.Modified;

                u = this.Mgr.AddUpdate(u);

                Unit.SaveChanges();
                return Ok(u);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
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
                var users = await Mgr.FindAll_Async(x => x.UserUniqueId.ToString().ToLower() == uniqueId && !x.IsDeleted && !x.EmailConfirmed, "", null, new List<string>() { });


                var user = users.FirstOrDefault();

                if (user != null)
                {
                    user.EmailConfirmed = true;
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
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("RegisterSupplier")]
        [HttpPost]
        public IHttpActionResult RegisterSupplier(User user, string password)
        {
            try
            {
                user = this.Mgr.RegisterSupplier(user, password);

                Unit.SaveChanges();

                var auth = new
                {
                    user = user,
                    token = AuthManager.GenerateToken(user)
                };
                return Ok(auth);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        [Route("KeepAlive")]
        [HttpPost]
        [KidsAppAuthorization]
        public async Task<IHttpActionResult> KeepAlive()
        {
            try
            {
                var user = await this.Mgr.FindById_Async(this.ActiveUser.Id);
                user.LastActiveDate = DateTime.Now;
                user.State = BaseState.Modified;
                Mgr.AddUpdate(user);

                Manager<Statistic> StatMgr = new Manager<Statistic>(Unit);
                Statistic Stat = new Statistic()
                {
                    Type = SharedEnums.StatisicType.UserAccess,
                    UserId = this.ActiveUser.Id,

                };
                StatMgr.AddUpdate(Stat);

                Unit.SaveChanges();

                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


        [Route("SaveToken")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult SaveToken(Token token)
        {
            try
            {

                var User = this.Mgr.FindById(this.ActiveUser.Id);

                PaymentManager PayMgr = new PaymentManager();
                var Cus = PayMgr.CreatePaymentCustomer(User);
                //Save Cus To DB !!
                var Card = PayMgr.CreatePaymentCard(token.id, Cus.id, User);
                //Save Card To DB !!
                Charge charge = new Charge()
                {
                    amount = 100,
                    currency = "AED",
                    threeDSecure = true,
                    save_card = true,
                    customer = Cus,
                    source = new ChargeSource() { id = token.id },
                    redirect = new ChargeRedirect()
                    {
                        url = "http://localhost:4200/test"
                    }

                };
                var charg = PayMgr.CreateCharge(charge);


                return Ok(true);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }


    }
}
