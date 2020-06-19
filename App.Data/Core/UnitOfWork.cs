using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data
{
    public class UOW
    {
        public static Core.UnitOfWork GetInstance()
        {
            Core.UnitOfWork u = new Core.UnitOfWork();
            u.Init(new AppContext());
            return u;
        }

    }
}
