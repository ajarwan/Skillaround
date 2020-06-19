using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{
    public class ExpressionAccessor<TEntity, TResult> : ExpressionVisitor
    {
        #region ----Properties----

        //private ReadOnlyCollection<ParameterExpression> parameters;
        private Expression<Func<TEntity, TResult>> Lambda;
        //public List<MemberExpression> ExpresionMembers { get; private set; }
        public List<string> Paths { get; private set; }

        #endregion

        #region ----Constructor----
        public ExpressionAccessor(Expression<Func<TEntity, TResult>> lambda)
        {
            this.Lambda = lambda;
            //this.parameters = lambda.Parameters;
            this.Paths = new List<string>();
        }
        #endregion

        #region ---- Methods ----
        protected override Expression VisitMember(MemberExpression node)
        {
            var temp = node;

            var Nodes = new List<MemberExpression>();


            while (node != null)
            {
                Nodes.Add(node);
                node = node.Expression as MemberExpression;
            }
            Nodes.Reverse();

            foreach (var _Node in Nodes)
            {
                string pName = _Node.Member.Name;
                if (Lambda.Parameters.Contains(_Node.Expression))
                {
                    Paths.Add(pName);
                }
                else
                {
                    Paths.Add(string.Concat(Paths.Last(), ".", pName));
                }


                //Type propertyType = _Node.Type;

                //if (!string.IsNullOrEmpty(Prop))
                //{
                //    Prop = string.Concat(".", propertyName);
                //}
                //else
                //{
                //    Prop = propertyName;
                //}

                //Paths.Add(Prop);
            }

            //string Prop = "";
            //var temp = node;

            //while (node != null)
            //{
            //    string propertyName = node.Member.Name;
            //    Type propertyType = node.Type;

            //    if (Lambda.Parameters.Contains(node.Expression))
            //    {
            //        if (!string.IsNullOrEmpty(Prop))
            //        {
            //            Prop += "." + propertyName;
            //            var chainedPath = string.Join(".", Prop.Split(new char[] { '.' }).Reverse());
            //            Paths.Add(chainedPath);
            //        }
            //        else
            //        {
            //            Prop = propertyName;
            //        }
            //    }
            //    else
            //    {
            //        if (!string.IsNullOrEmpty(Prop))
            //        {
            //            Prop += "." + propertyName;
            //            var chainedPath = string.Join(".", Prop.Split(new char[] { '.' }).Reverse());
            //            Paths.Add(chainedPath);
            //        }
            //        else
            //        {
            //            Prop = string.Concat(Paths.Last(), ".", propertyName);
            //        }
            //    }

            //    node = node.Expression as MemberExpression;
            //}

            //var Path = string.Join(".", Prop.Split(new char[] { '.' }).Reverse());
            //Paths.Add(Path);

            return temp;
        }


        protected override Expression VisitLambda<T>(Expression<T> node)
        {

            return base.VisitLambda(node);
        }

        protected override Expression VisitMethodCall(MethodCallExpression node)
        {

            return base.VisitMethodCall(node);
        }



        #endregion

        public static IEnumerable<string> GetPaths(
            Expression<Func<TEntity, TResult>> Includes)
        {

            var visitor = new ExpressionAccessor<TEntity, TResult>(Includes);
            visitor.Visit(Includes);
            return visitor.Paths.Distinct();
        }



    }
}
