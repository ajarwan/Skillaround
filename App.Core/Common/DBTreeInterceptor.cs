using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{

    public class DBTreeInterceptor : IDbCommandTreeInterceptor
    {
        public const string IsDeletedColumnName = "IsDeleted";
 
        public DBTreeInterceptor()
        {

        }
        
        public void TreeCreated(DbCommandTreeInterceptionContext interceptionContext)
        {
             
            if (interceptionContext.OriginalResult.DataSpace != DataSpace.SSpace)
                return;

            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();
            if (context == null || (context != null && context.options == null) || (context != null && context.options != null && !context.options.IncludeIsDelete))
                return;

            var queryCommand = interceptionContext.Result as DbQueryCommandTree;
            if (queryCommand != null)
            {
                interceptionContext.Result = HandleQueryCommand(queryCommand);
            }

        }

        private static DbCommandTree HandleQueryCommand(DbQueryCommandTree queryCommand)
        {
            var newQuery = queryCommand.Query.Accept(new IsDeleteQueryVisitor());
            return new DbQueryCommandTree(
                queryCommand.MetadataWorkspace,
                queryCommand.DataSpace,
                newQuery);
        }

        public class IsDeleteQueryVisitor : DefaultExpressionVisitor
        {
            public override DbExpression Visit(DbScanExpression expression)
            {
                var table = (EntityType)expression.Target.ElementType;
                if (table.Properties.All(p => p.Name != IsDeletedColumnName))
                    return base.Visit(expression);

                DbExpression newConditionExpression = null;
                var binding = expression.Bind();

                if (table.Properties.Any(p => p.Name == IsDeletedColumnName))
                {
                    var param = DbExpression.FromBoolean(false);
                    var columnProperty = DbExpressionBuilder.Property(DbExpressionBuilder.Variable(binding.VariableType, binding.VariableName), IsDeletedColumnName);

                    if ((columnProperty.ResultType.EdmType.FullName == "Edm.Boolean")
                            && param.ResultType.EdmType.FullName.StartsWith("Oracle", StringComparison.CurrentCultureIgnoreCase) && (param.ResultType.EdmType.Name == "number"))
                        newConditionExpression = DbExpressionBuilder.Equal(DbExpressionBuilder.CastTo(columnProperty, param.ResultType), param);
                    else
                        newConditionExpression = DbExpressionBuilder.Equal(columnProperty, param);

                }

                return DbExpressionBuilder.Filter(binding, newConditionExpression);

                //return binding.Filter(
                //    binding.VariableType
                //        .Variable(binding.VariableName)
                //        .Property(IsDeletedColumnName)
                //        .Equal(DbExpression.FromBoolean(false)));               

            }


            //public override DbExpression Visit(DbFilterExpression expression)
            //{
            //    //  If the query contains it's own filter condition (in a .Where() for example), this will be called
            //    //  before Visit(DbScanExpression).  And it will contain the Predicate specified in that filter.
            //    //  Need to inject our dynamic filters here and then 'and' the Predicate.  This is necessary so that
            //    //  the expressions are properly ()'d.
            //    //  It also allows us to attach our dynamic filter into the same DbExpressionBinding so it will avoid
            //    //  creating a new sub-query in MS SQL Server.
            //    var predicate = VisitExpression(expression.Predicate);      //  Visit the predicate so filters will be applied to any child properties inside it (issue #61)

            //    string entityName = expression.Input.Variable.ResultType.EdmType.Name;
            //    //var containers = _ObjectContext.MetadataWorkspace.GetItems<EntityContainer>(DataSpace.SSpace).First();
            //    // var filterList = FindFiltersForEntitySet(expression.Input.Variable.ResultType.EdmType.MetadataProperties, containers);

            //    var newFilterExpression = BuildFilterExpressionWithDynamicFilters(entityName, new List<string>() { IsDeletedColumnName }, expression.Input, predicate);
            //    if (newFilterExpression != null)
            //    {
            //        //  If not null, a new DbFilterExpression has been created with our dynamic filters.
            //        return newFilterExpression;
            //    }

            //    return base.Visit(expression);
            //}
            //public override DbExpression Visit(DbScanExpression expression)
            //{
            //    var table = (EntityType)expression.Target.ElementType;
            //    if (table.Properties.All(p => p.Name != IsDeletedColumnName))
            //    {
            //        return base.Visit(expression);
            //    }

            //    string entityName = expression.Target.Name;
            //    var baseResult = base.Visit(expression);
            //    var binding = DbExpressionBuilder.Bind(baseResult);
            //    var newFilterExpression = BuildFilterExpressionWithDynamicFilters(entityName, new List<string>() { IsDeletedColumnName }, binding, null);
            //    if (newFilterExpression != null)
            //    {
            //        //  If not null, a new DbFilterExpression has been created with our dynamic filters.
            //        return newFilterExpression;
            //    }
            //    return baseResult;              

            //}


            //public override DbExpression Visit(DbJoinExpression expression)
            //{                
            //    DbExpressionBinding left = this.VisitExpressionBinding(expression.Left);             
            //    DbExpressionBinding right = this.VisitExpressionBinding(expression.Right);

            //    var rightProperty = DbExpressionBuilder.Property(right.Variable, IsDeletedColumnName);                
            //    var predicateExpression = DbExpressionBuilder.Equal(rightProperty, DbExpression.FromBoolean(false));                
            //    var joinCondition = DbExpressionBuilder.And(expression.JoinCondition, predicateExpression);

            //    DbExpression newExpression = expression;

            //    //only re-create the join if something changed
            //    //if (!ReferenceEquals(expression.Left, left)
            //    //    || !ReferenceEquals(expression.Right, right)
            //    //    || !ReferenceEquals(expression.JoinCondition, joinCondition))
            //    //{
            //    switch (expression.ExpressionKind)
            //    {
            //        case DbExpressionKind.InnerJoin:
            //            newExpression = DbExpressionBuilder.InnerJoin(left, right, joinCondition);
            //            break;
            //        case DbExpressionKind.LeftOuterJoin:
            //            newExpression = DbExpressionBuilder.LeftOuterJoin(left, right, joinCondition);
            //            break;
            //        case DbExpressionKind.FullOuterJoin:
            //            newExpression = DbExpressionBuilder.FullOuterJoin(left, right, joinCondition);
            //            break;
            //    }
            //    //}

            //    return newExpression;
            //}


            private DbFilterExpression BuildFilterExpressionWithDynamicFilters(string entityName, IEnumerable<string> filterList, DbExpressionBinding binding, DbExpression predicate)
            {
                if (!filterList.Any())
                    return null;

                var edmType = binding.VariableType.EdmType as EntityType;
                if (edmType == null)
                    return null;

                List<DbExpression> conditionList = new List<DbExpression>();

                HashSet<string> processedFilterNames = new HashSet<string>();
                foreach (var filter in filterList)
                {
                    if (processedFilterNames.Contains(filter))
                        continue;       //  Already processed this filter - attribute was probably inherited in a base class
                    processedFilterNames.Add(filter);

                    DbExpression dbExpression;
                    if (!string.IsNullOrEmpty(filter))
                    {
                        //  Single column equality filter
                        //  Need to map through the EdmType properties to find the actual database/cspace name for the entity property.
                        //  It may be different from the entity property!
                        var edmProp = edmType.Properties.Where(p => p.MetadataProperties.Any(m => m.Name == "PreferredName" && m.Value.Equals(filter))).FirstOrDefault();
                        if (edmProp == null)
                            continue;       //  ???
                                            //  database column name is now in edmProp.Name.  Use that instead of filter.ColumnName

                        var columnProperty = DbExpressionBuilder.Property(DbExpressionBuilder.Variable(binding.VariableType, binding.VariableName), edmProp.Name);
                        //var param = columnProperty.Property.TypeUsage.Parameter(filter.CreateDynamicFilterName(filter.ColumnName, DataSpace.SSpace));
                        var param = DbExpression.FromBoolean(false);

                        //  When using SSpace, need some special handling for an Oracle Boolean property.
                        //  Not necessary when using CSpace since the translation into the Oracle types has not happened yet.
                        if ((columnProperty.ResultType.EdmType.FullName == "Edm.Boolean")
                            && param.ResultType.EdmType.FullName.StartsWith("Oracle", StringComparison.CurrentCultureIgnoreCase) && (param.ResultType.EdmType.Name == "number"))    //  Don't trust Oracle's type name to stay the same...
                        {
                            //  Special handling needed for columnProperty boolean.  For some reason, the Oracle EF driver does not correctly
                            //  set the ResultType to a number(1) in columnProperty like it does in columnProperty.Property.TypeUsage.  That
                            //  results in us trying to do a comparison of a Boolean to a number(1) which causes DbExpressionBuilder.Equal
                            //  to throw an exception.  To get this to process correctly, we need to do a cast on the columnProperty to
                            //  "number(1)" so that it matches the param.ResultType.  And that results in the sql sent to Oracle converting
                            //  the column to the type that it already is...
                            dbExpression = DbExpressionBuilder.Equal(DbExpressionBuilder.CastTo(columnProperty, param.ResultType), param);
                        }
                        else
                            dbExpression = DbExpressionBuilder.Equal(columnProperty, param);

                        conditionList.Add(dbExpression);

                    }


                }

                int numConditions = conditionList.Count;
                DbExpression newPredicate;
                switch (numConditions)
                {
                    case 0:
                        return null;

                    case 1:
                        newPredicate = conditionList.First();
                        break;

                    default:
                        //  Have multiple conditions.  Need to append them together using 'and' conditions.
                        newPredicate = conditionList.First();

                        for (int i = 1; i < numConditions; i++)
                            newPredicate = newPredicate.And(conditionList[i]);
                        break;
                }

                //  'and' the existing Predicate if there is one
                if (predicate != null)
                    newPredicate = newPredicate.And(predicate);

                return DbExpressionBuilder.Filter(binding, newPredicate);
            }


        }



    }


}
