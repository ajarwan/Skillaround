using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Common
{
    public class EntityDescriptor<TEntity>
    {
        public static string Property<TProp>(Expression<Func<TEntity, TProp>> expression)
        {
            var body = expression.Body as MemberExpression;
            if (body == null)
                throw new ArgumentException("'expression' should be a member expression");
            return body.Member.Name;
        }

        public static string ClassName(bool WithNameSpace = false)
        {

            var EntityName = System.ComponentModel.TypeDescriptor.GetClassName(typeof(TEntity));

            if (!WithNameSpace)
                EntityName = EntityName.Split(new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries).Last();

            return EntityName;
        }
    }

}
