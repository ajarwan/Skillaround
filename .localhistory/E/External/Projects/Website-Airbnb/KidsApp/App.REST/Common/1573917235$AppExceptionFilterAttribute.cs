using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace App.REST.Common
{
    public class AppExceptionFilterAttribute : ExceptionFilterAttribute
    {

        public override void OnException(HttpActionExecutedContext context)
        {

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