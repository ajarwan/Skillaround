using App.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace App.REST
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
        }

        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            var Request = System.Web.HttpContext.Current.Request;
            //var CurrentLang = LanguageEnum.Arabic;

            if (Request != null && Request.Headers != null && Request.Headers["Lang"] != null)
            {
                switch (Request.Headers["Lang"].ToLower())
                {
                    case "ar":
                        UnitOfWork.Language = LanguageEnum.Arabic;
                        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(ConfigurationManager.AppSettings["ArabicCulture"]);
                        System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(ConfigurationManager.AppSettings["ArabicCulture"]);
                        System.Threading.Thread.CurrentThread.CurrentCulture.DateTimeFormat = new System.Globalization.CultureInfo("en-US").DateTimeFormat;
                        break;
                    case "en":
                        UnitOfWork.Language = LanguageEnum.English;
                        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(ConfigurationManager.AppSettings["EnglishCulture"]);
                        System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(ConfigurationManager.AppSettings["EnglishCulture"]);
                        break;
                }
            }
            HttpContext.Current.Items.Add("Lang", UnitOfWork.Language);
            //HttpContext.Current.Items.Add("Lang", CurrentLang);

        }
    }


}
