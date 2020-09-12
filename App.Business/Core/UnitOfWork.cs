using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Business
{
    public class UOW : IDisposable
    {

        //public static User ActiveUser { get; set; }

        public static UnitOfWork GetInstance()
        {
            return App.Data.UOW.GetInstance();
        }

        public static UnitOfWork GetInstanceForJobs()
        {
            var u = App.Data.UOW.GetInstance();
            u.UserId = 1;
            return u;
        }

        public void Dispose()
        {

        }
    }
}
