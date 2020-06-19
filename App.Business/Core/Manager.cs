using App.Core;
using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Business.Core
{

    public class Manager<TEntity> : BusinessBase<TEntity> where TEntity : EntityBase
    {
        public Manager(IUnitOfWork uw) : base(new RepositoryBase<TEntity>(uw))
        {

        }
    }
}
