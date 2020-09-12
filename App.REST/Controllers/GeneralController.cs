using App.Entity;
using App.Entity.DTO;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.ServiceModel.Channels;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/General")]

    public class GeneralController : BaseController
    {

        [Route("Upload")]
        [HttpPost]
        public IHttpActionResult Upload()
        {
            try
            {
                SharedEnums.AttachmentLocationType type = (SharedEnums.AttachmentLocationType)(int.Parse(HttpContext.Current.Request.Form["type"].ToString()));
                HttpPostedFile file = HttpContext.Current.Request.Files[0];


                var directoryPath = AppDomain.CurrentDomain.BaseDirectory;

                var directoySubPath = @"attachments\";

                var fileName = Guid.NewGuid() + System.IO.Path.GetExtension(file.FileName);



                switch (type)
                {
                    case SharedEnums.AttachmentLocationType.Activity:
                        directoySubPath += @"activity\";
                        break;
                    case SharedEnums.AttachmentLocationType.Users:
                        directoySubPath += @"user\";
                        break;
                }

                var FolderPath = Path.Combine(directoryPath, directoySubPath);

                if (!Directory.Exists(FolderPath))
                    Directory.CreateDirectory(FolderPath);


                directoySubPath += fileName;




                //byte[] imageBytes = Convert.FromBase64String(file.File);
                //File.WriteAllBytes(FolderPath + fileName, imageBytes);

                file.SaveAs(FolderPath + fileName);
                return Ok(directoySubPath);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }

        [Route("Location")]
        [HttpGet]
        public async Task<IHttpActionResult> Location()
        {
            try
            {
                var request = Request;
                string ip = "";
                if (request.Properties.ContainsKey("MS_HttpContext"))
                {
                    ip=((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
                }
                else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
                {
                    RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)this.Request.Properties[RemoteEndpointMessageProperty.Name];
                    ip= prop.Address;
                }
                else if (HttpContext.Current != null)
                {
                    ip= HttpContext.Current.Request.UserHostAddress;
                }

                Unit.LogError(new Exception("Ip Address IS --- " + ip));

                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri("http://ip-api.com");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage response = await client.GetAsync("/json/"+ ip);
                if (response.IsSuccessStatusCode)
                {
                    var res = await response.Content.ReadAsAsync<JObject>();
                    return Ok(res);
                }
                else
                    return BadRequest();

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
