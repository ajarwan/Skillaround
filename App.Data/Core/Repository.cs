using App.Core;
using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Data
{
 

    public class Repository<TEntity, TKey> : RepositoryBase<TEntity> where TEntity : EntityBase
    {
        private IUnitOfWork UW;
        public Repository(IUnitOfWork uw) : base(uw)
        {
            UW = uw;
        }
    }
}
