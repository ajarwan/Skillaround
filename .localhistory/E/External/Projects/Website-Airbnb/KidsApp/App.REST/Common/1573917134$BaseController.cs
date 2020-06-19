using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace App.REST.Common
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [AppExceptionFilter]
     public class BaseController : ApiController
    {

    }
}