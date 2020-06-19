using App.Entity.Models;
using App.REST.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace App.REST
{
    public class KidsAppAuthorization : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext filterContext)
        {
            try
            {

                var token = filterContext.Request.Headers.FirstOrDefault(x => x.Key.ToLower() == "authorization");
                User user = null;
                var token_str = "";
                bool isValid = false;
                if (token.Value != null && token.Key != null)
                {
                    token_str = token.Value.First();
                    isValid = AuthManager.ValidateToken(token_str, out user);

                    //if (!AuthManager.ValidateToken(token_str, out user))
                    //{
                    //    //this.ShowAuthenticationError(filterContext);
                    //    return;
                    //}
                    //HttpContext.Current.Items.Add("ActiveUser", user);

                }



                if (filterContext.ActionDescriptor.GetCustomAttributes<KidsAppAuthorization>().Any()
            || filterContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<KidsAppAuthorization>().Any())
                {
                    if (!isValid || user == null || user.Id < 1)
                    {
                        this.ShowAuthenticationError(filterContext);
                        return;
                    }

                }

                if (user != null && user.Id > 0)
                    HttpContext.Current.Items.Add("ActiveUser", user);


                base.OnAuthorization(filterContext);
            }
            catch (Exception ex)
            {

                this.ShowAuthenticationError(filterContext);
            }


        }

        public void ShowAuthenticationError(HttpActionContext filterContext)
        {
            var responseDTO = new { Code = 401, Message = "Unable to access, Please login again" };
            filterContext.Response =
            filterContext.Request.CreateResponse(HttpStatusCode.Unauthorized, responseDTO);
        }

    }
}