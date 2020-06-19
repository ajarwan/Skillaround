using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{
    public enum OrderDirection
    {
        ASC = 0,
        DESC = 1
    }

    
    public class OrderBy<TEntity> where TEntity : EntityBase
    {
        //public Expression<Func<TEntity,object>> Order { set; get; }
        internal LambdaExpression Order { set; get; }
        internal OrderDirection Direction { set; get; } = OrderDirection.ASC;
        internal string OrderStr { set; get; }


        public static OrderBy<TEntity> Add<TKey>(Expression<Func<TEntity, TKey>> expression, OrderDirection dir = OrderDirection.ASC)
        {
            return new OrderBy<TEntity>() { Order = expression, Direction = dir };
        }

        public static OrderBy<TEntity> Add(string orderStr)
        {
            return new OrderBy<TEntity>() { OrderStr = orderStr };
        }


    }
}
