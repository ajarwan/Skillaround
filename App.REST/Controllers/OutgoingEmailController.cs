using App.Business;
using App.Business.Core;
using App.Business.Extended;
using App.Core;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace App.REST.Controllers
{
    [RoutePrefix("Api/OutgoingEmail")]

    public class OutgoingEmailController : BaseController
    {
        private readonly Manager<OutgoingEmail> Mgr;

        public OutgoingEmailController()
        {
            Mgr = new Manager<OutgoingEmail>(Unit);
        }

        [Route("")]
        [HttpPost]
        [KidsAppAuthorization]
        public IHttpActionResult AddOutgoingEmail(OutgoingEmail outgoingEmail)
        {
            try
            {
                if (this.ActiveUser.UserType != SharedEnums.UserTypes.Manager)
                    return BadRequest();




                //Save Reply
                outgoingEmail.State = BaseState.Added;
                Mgr.AddUpdate(outgoingEmail);
                Unit.SaveChanges();

                return Ok(outgoingEmail);
            }
            catch (Exception ex)
            {
                Unit.LogError(ex, this.ToString(), this.ActionContext.ActionArguments.ToList());
                return InternalServerError(ex);
            }
        }
    }
}
