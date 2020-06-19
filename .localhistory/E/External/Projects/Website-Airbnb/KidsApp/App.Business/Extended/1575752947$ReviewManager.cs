using App.Core;
using App.Core.Base;
using App.Data.Extended;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Business.Extended
{
    public class ReviewManager : BusinessBase<Review>
    {
        #region "----Constructor----"
        public ReviewManager(IUnitOfWork uw) : base(new ReviewRespository(uw))
        {
        }
        public ReviewRespository RepositoryBase
        {
            get
            {
                return ((ReviewRespository)Repository);
            }
        }
        #endregion
    }
}
