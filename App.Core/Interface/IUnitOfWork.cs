using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{
    public interface IUnitOfWork
    {

        ContextBase GetContext();
        void SaveChanges();

        void RollBack();

        void Dispose();

    }
}
