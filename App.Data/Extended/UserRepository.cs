using App.Core;
using App.Core.Base;
using App.Entity;
using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Data.Extended
{
    public class UserRepository : RepositoryBase<User>
    {
        public UserRepository(IUnitOfWork uw) : base(uw)
        {

        }

        public List<string> GetUserEmails(SharedEnums.MailReceiverType type)
        {
            Expression<Func<User, bool>> Filter = x => !x.IsDeleted && x.IsActive;

            if (type != SharedEnums.MailReceiverType.All)
            {
                if (type == SharedEnums.MailReceiverType.Users)
                    Filter = Filter.And(x => !x.IsSupplier && x.UserType == SharedEnums.UserTypes.Normal);
                else if (type == SharedEnums.MailReceiverType.Suppliers)
                    Filter = Filter.And(x => x.IsSupplier && x.IsSupplierVerified);
                else if (type == SharedEnums.MailReceiverType.Admins)
                    Filter = Filter.And(x => x.UserType == SharedEnums.UserTypes.Manager);

            }
            var Q = dbSet.Where(Filter);

            var Results = Q.Select(x => x.Email).ToList();


            return Results;

        }

        public bool CheckUserActive(int userId)
        {
            Expression<Func<User, bool>> Filter = x => !x.IsDeleted && x.Id == userId;
            return dbSet.Where(Filter).Select(x => x.IsActive).FirstOrDefault();

        }

    }
}
