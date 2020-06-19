using App.Core;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Owin;
using System;
using System.Configuration;
using System.Linq;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using App.Business;

namespace App.REST
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.CreatePerOwinContext<UnitOfWork>(UOW.GetInstance);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);


            HttpConfiguration httpConfig = new HttpConfiguration();
            ConfigureWebApi(httpConfig);
            app.UseWebApi(httpConfig);
            httpConfig.EnableCors();
        }

        private void ConfigureWebApi(HttpConfiguration config)
        {
            //Exeption Handlar
            //config.Services.Replace(typeof(IExceptionHandler), new AppExceptionHandler());

            //build routes based on the config
            config.MapHttpAttributeRoutes();

            //Defualt Route with no Attibute 
            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            // Remove the XML formatter
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                //TypeNameHandling = TypeNameHandling.Objects,
                //ContractResolver = new HtmlEncodeResolver(),
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                DateFormatString = ConfigurationManager.AppSettings["ApiDateFormatString"],
                DateTimeZoneHandling = DateTimeZoneHandling.Local,
                //Converters = { new ReferenceResolverJsonConverter() }
            };

            //GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind;


            JsonConvert.DefaultSettings = () => new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, DateFormatString = ConfigurationManager.AppSettings["ApiDateFormatString"] };

            //var cors = new EnableCorsAttribute(
            //origins: "*",
            //headers: "*",
            //methods: "*");

            config.EnableCors();


        }

    }
}