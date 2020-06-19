using App.Core;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace App.REST
{
    public class AppExceptionFilterAttribute : ExceptionFilterAttribute
    {

        public override void OnException(HttpActionExecutedContext context)
        {
            var Unit = HttpContext.Current.GetOwinContext().GetUserManager<UnitOfWork>();

            Unit.LogError(context.Exception,
                context.ActionContext.ControllerContext.Controller.ToString(),
                context.ActionContext.ActionArguments.ToList(),
                context.ActionContext.ActionDescriptor.ActionName);

            var IsProduction = Convert.ToBoolean(ConfigurationManager.AppSettings["IsProduction"]);

            context.Response = new HttpResponseMessage()
            {
                Content = IsProduction ? new StringContent("An Error Occured, please check the logs")
                : new StringContent((context.Exception.Message + " -- " + context.Exception.StackTrace)),
                StatusCode = System.Net.HttpStatusCode.InternalServerError
            };
        }
    }
}