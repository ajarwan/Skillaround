﻿using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity; 

namespace App.REST
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [AppExceptionFilter]
    [KidsAppAuthorization]
    public class BaseController : ApiController
    {
        public UnitOfWork Unit { set; get; }

        public BaseController()
        {
            Unit = HttpContext.Current.GetOwinContext().GetUserManager<UnitOfWork>();
        }
    }
}