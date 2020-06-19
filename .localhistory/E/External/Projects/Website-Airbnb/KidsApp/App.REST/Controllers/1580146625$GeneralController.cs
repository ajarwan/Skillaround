﻿using App.Entity;
using System;
using System.Collections.Generic;
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
        public IHttpActionResult Upload(string file, SharedEnums.AttachmentLocationType type)
        {
            try
            {
                var path = AppDomain.CurrentDomain.BaseDirectory + @"\bin";

                var TemplatePath = Path.Combine(path, @"AD\WelcomMailTemplate.html");


                return Ok(file);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
