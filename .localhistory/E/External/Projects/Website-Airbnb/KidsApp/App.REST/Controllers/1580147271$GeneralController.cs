using App.Entity;
using App.Entity.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace App.REST.Controllers
{
    [RoutePrefix("Api/General")]

    public class GeneralController : BaseController
    {

        [Route("Upload")]
        [HttpPost]
        public IHttpActionResult Upload(FileDTO file)
        {
            try
            {

                file.File = file.File.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries)[1];

                var directoryPath = AppDomain.CurrentDomain.BaseDirectory;

                var directoySubPath = @"attachments\";

                var fileName = Guid.NewGuid() + "." + file.Ext;



                switch (file.Type)
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




                byte[] imageBytes = Convert.FromBase64String(file.File);

                File.WriteAllBytes(FolderPath + fileName, imageBytes);
                return Ok(directoySubPath);

            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
