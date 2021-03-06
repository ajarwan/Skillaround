﻿using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;
using App.Entity.Models;
using App.REST.Common;

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
            HttpContext.Current.Response.Headers.Add("access-control-expose-headers", "X-Token");
            Unit = HttpContext.Current.GetOwinContext().GetUserManager<UnitOfWork>();
            //Unit.UserId = LoadUser();
             
            var x = RequestContext.Principal.Identity.Name;
        }

        public User ActiveUser
        {
            get
            {
                return (User)HttpContext.Current.Items["ActiveUser"];
            }
            set { }

        }

    
    }
}