using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.REST.Common
{
    public class AppExceptionFilterAttribute : ExceptionFilterAttribute
    {

        public override void OnException(HttpActionExecutedContext context)
        {

            var IsProduction = Convert.ToBoolean(ConfigurationManager.AppSettings["IsProduction"]);
            var Unit = HttpContext.Current.GetOwinContext().GetUserManager<UnitOfWork>();

            Unit.Logger.Error(
                context.Exception,
                context.ActionContext.ControllerContext.Controller.ToString(),
                context.ActionContext.ActionArguments.ToList(),
                context.ActionContext.ActionDescriptor.ActionName);

            context.Response = new HttpResponseMessage()
            {
                Content = IsProduction ? new StringContent("An Error Occured, please check the logs")
                : new StringContent((context.Exception.Message + " -- " + context.Exception.StackTrace)),
                StatusCode = System.Net.HttpStatusCode.InternalServerError
            };
        }
    }
}