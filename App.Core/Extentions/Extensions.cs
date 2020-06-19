using App.Core.Common;
using EntityFramework.Extensions;
using EntityFramework.Mapping;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace App.Core
{
    public static class Extensions
    {
        public static TEntity Clone<TEntity>(this TEntity source, JsonSerializerSettings settings = null)
        {
            if (source == null)
                return source;

            if (settings == null)
                settings = JsonAuditSerilizeOptions.Get();

            string json = JsonConvert.SerializeObject(source, settings);
            TEntity obj = JsonConvert.DeserializeObject<TEntity>(json, new BooleanJsonConverter());
            return obj;
        }
        public static List<TEntity> Clone<TEntity>(this List<TEntity> source, JsonSerializerSettings settings = null)
        {
            if (source == null || source.Count == 0)
                return source;

            if (settings == null)
                settings = JsonAuditSerilizeOptions.Get();

            List<TEntity> result = new List<TEntity>();
            foreach (var t in source)
                result.Add(t.Clone());

            return result;
        }

        //Context Extensions
        public static IEnumerable<Tuple<object, object, ObjectStateEntry>> GetAddedRelationships(
            this DbContext context)
        {
            return GetRelationships(context, EntityState.Added, (e, i) => e.CurrentValues[i]);
        }

        public static IEnumerable<Tuple<object, object, ObjectStateEntry>> GetDeletedRelationships(
            this DbContext context)
        {
            return GetRelationships(context, EntityState.Deleted, (e, i) => e.OriginalValues[i]);
        }

        private static IEnumerable<Tuple<object, object, ObjectStateEntry>> GetRelationships(
            this DbContext context,
            EntityState relationshipState,
            Func<ObjectStateEntry, int, object> getValue)
        {
            //context.ChangeTracker.DetectChanges();
            var objectContext = ((IObjectContextAdapter)context).ObjectContext;

            return objectContext
                .ObjectStateManager
                .GetObjectStateEntries(relationshipState)
                .Where(e => e.IsRelationship)
                .Select(
                    e => Tuple.Create(
                        objectContext.GetObjectByKey((EntityKey)getValue(e, 0)),
                        objectContext.GetObjectByKey((EntityKey)getValue(e, 1)),
                        e)
                    );

        }


        //Lamda Extensions
        public static Expression<T> Compose<T>(this Expression<T> leftExpression, Expression<T> rightExpression, Func<Expression, Expression, Expression> merge)
        {
            var map = leftExpression.Parameters.Select((left, i) => new
            {
                left,
                right = rightExpression.Parameters[i]
            }).ToDictionary(p => p.right, p => p.left);

            var rightBody = ExpressionRebinder.ReplacementExpression(map, rightExpression.Body);

            return Expression.Lambda<T>(merge(leftExpression.Body, rightBody), leftExpression.Parameters);
        }
        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
        {
            if (left != null)
                return left.Compose(right, Expression.And);
            else
                return right;
        }
        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
        {
            if (left != null)
                return left.Compose(right, Expression.Or);
            else
                return right;
        }


        //AuditTrail Related Extensions
        public static SqlQueryData GetSelectQuery<TEntity>(this ObjectQuery<TEntity> query, EntityMap entityMap)
   where TEntity : class
        {
            var sqlQueryData = new SqlQueryData();

            // changing query to only select keys
            var selector = new StringBuilder(50);
            selector.Append("new(");
            foreach (var propertyMap in entityMap.KeyMaps)
            {
                if (selector.Length > 4)
                    selector.Append((", "));

                selector.Append(propertyMap.PropertyName);
            }

            //get security column in the select
            string securityLevelColName = "";
            if (entityMap.EntityType.GetProperty("SecurityLevelId") != null)
                securityLevelColName = "SecurityLevelId";

            if (entityMap.EntityType.GetProperty("FinalSecurityLevel") != null)
                securityLevelColName = "FinalSecurityLevel";
            if (!string.IsNullOrEmpty(securityLevelColName))
            {
                if (selector.Length > 4)
                    selector.Append((", "));

                selector.Append(securityLevelColName);
            }

            selector.Append(")");


            var selectQuery = DynamicQueryable.Select(query, selector.ToString());
            var objectQuery = selectQuery as ObjectQuery;

            if (objectQuery == null)
                throw new ArgumentException("The query must be of type ObjectQuery.", "query");

            sqlQueryData.QueryString = objectQuery.ToTraceString();

            // create parameters
            foreach (var objectParameter in objectQuery.Parameters)
            {
                sqlQueryData.Parameters.Add(objectParameter.Name, objectParameter.Value ?? DBNull.Value);
                sqlQueryData.SqlParameters.Add(new SqlParameter() { ParameterName = objectParameter.Name, Value = objectParameter.Value ?? DBNull.Value });
            }

            return sqlQueryData;
        }

        public static SqlQueryData GetUpdateQuery<TEntity>(this Expression<Func<TEntity, TEntity>> updateExpr, ObjectContext objectContext, EntityMap entityMap)
    where TEntity : class
        {
            var initExpr = updateExpr.Body as MemberInitExpression;
            if (initExpr == null)
                throw new ArgumentException("updateExpr expression must be MemberInitExpression.", "updateExpr");

            int nameCount = 0;
            bool wroteSet = false;

            var sqlBuilder = new StringBuilder();
            var sqlQueryData = new SqlQueryData();
            sqlBuilder.Append("UPDATE ");
            sqlBuilder.Append(entityMap.TableName);
            sqlBuilder.AppendLine(" SET ");

            // Iterate over the member bindings
            foreach (var binding in initExpr.Bindings)
            {
                if (wroteSet)
                    sqlBuilder.AppendLine(", ");

                string propName = binding.Member.Name;
                string colName = entityMap
                    .PropertyMaps
                    .Where(x => x.PropertyName == propName)
                    .Select(x => x.ColumnName)
                    .FirstOrDefault();

                var memberAssignment = binding as MemberAssignment;
                var memberExpression = memberAssignment.Expression;
                ParameterExpression parameterExpression = null;
                memberExpression.Visit((ParameterExpression p) =>
                {
                    if (p.Type == entityMap.EntityType)
                        parameterExpression = p;

                    return p;
                });

                if (parameterExpression == null)
                {
                    object value;

                    if (memberExpression.NodeType == ExpressionType.Constant)
                    {
                        var constantExpression = memberExpression as ConstantExpression;
                        if (constantExpression == null)
                            throw new ArgumentException(
                                "The MemberAssignment expression is not a ConstantExpression.", "updateExpression");

                        value = constantExpression.Value;
                    }
                    else
                    {
                        LambdaExpression lambda = Expression.Lambda(memberExpression, null);
                        value = lambda.Compile().DynamicInvoke();
                    }

                    if (value != null)
                    {
                        string parameterName = "p__update__" + nameCount++;

                        sqlQueryData.Parameters.Add(parameterName, value);
                        sqlQueryData.SqlParameters.Add(new SqlParameter() { ParameterName = parameterName, Value = value });
                        sqlBuilder.AppendFormat("[{0}] = @{1}", colName, parameterName);
                    }
                    else
                    {
                        sqlBuilder.AppendFormat("[{0}] = NULL", colName);
                    }
                }
                else
                {
                    // create clean objectset to build query from
                    var objectSet = objectContext.CreateObjectSet<TEntity>();

                    Type[] typeArguments = new[] { entityMap.EntityType, memberExpression.Type };

                    ConstantExpression constantExpression = Expression.Constant(objectSet);
                    LambdaExpression lambdaExpression = Expression.Lambda(memberExpression, parameterExpression);

                    MethodCallExpression selectExpression = Expression.Call(
                        typeof(Queryable),
                        "Select",
                        typeArguments,
                        constantExpression,
                        lambdaExpression);

                    // create query from expression
                    var selectQuery = objectSet.CreateQuery(selectExpression, entityMap.EntityType);
                    string sql = selectQuery.ToTraceString();

                    // parse select part of sql to use as update
                    string regex = @"SELECT\s*\r\n\s*(?<ColumnValue>.+)?\s*AS\s*(?<ColumnAlias>\[\w+\])\r\n\s*FROM\s*(?<TableName>\[\w+\]\.\[\w+\]|\[\w+\])\s*AS\s*(?<TableAlias>\[\w+\])";
                    Match match = Regex.Match(sql, regex);
                    if (!match.Success)
                        throw new ArgumentException("The MemberAssignment expression could not be processed.", "updateExpression");

                    string value = match.Groups["ColumnValue"].Value;
                    string alias = match.Groups["TableAlias"].Value;

                    value = value.Replace(alias + ".", "");

                    foreach (ObjectParameter objectParameter in selectQuery.Parameters)
                    {
                        string parameterName = "p__update__" + nameCount++;

                        sqlQueryData.Parameters.Add(parameterName, objectParameter.Value ?? DBNull.Value);
                        sqlQueryData.SqlParameters.Add(new SqlParameter() { ParameterName = objectParameter.Name, Value = objectParameter.Value ?? DBNull.Value });
                        value = value.Replace(objectParameter.Name, parameterName);
                    }
                    sqlBuilder.AppendFormat("[{0}] = {1}", colName, value);
                }
                wroteSet = true;
            }

            sqlQueryData.QueryString = sqlBuilder.ToString();
            return sqlQueryData;
        }


        public static SqlQueryData GetUpdateQuery(this Dictionary<string, string> updateProps, ObjectContext objectContext, EntityMap entityMap)
        {
            if (updateProps == null || (updateProps != null && updateProps.Count() == 0))
                throw new ArgumentException("updateProps must have at least one property.", "updateProps");

            int nameCount = 0;
            bool wroteSet = false;

            var sqlBuilder = new StringBuilder();
            var sqlQueryData = new SqlQueryData();
            sqlBuilder.Append("UPDATE ");
            sqlBuilder.Append(entityMap.TableName);
            sqlBuilder.AppendLine(" SET ");

            // Iterate over the member bindings
            foreach (KeyValuePair<string, string> keyVal in updateProps)
            {
                if (wroteSet)
                    sqlBuilder.AppendLine(", ");

                string propName = keyVal.Key;
                string colName = entityMap
                    .PropertyMaps
                    .Where(x => x.PropertyName == propName)
                    .Select(x => x.ColumnName)
                    .FirstOrDefault();

                if (string.IsNullOrEmpty(colName))
                    throw new ArgumentException("The table " + entityMap.TableName + " doesn't has a column mapped with a Property name " + keyVal.Key);

                if (!string.IsNullOrEmpty(keyVal.Value))
                {
                    string parameterName = "p__update__" + nameCount++;

                    sqlQueryData.Parameters.Add(parameterName, keyVal.Value);
                    sqlQueryData.SqlParameters.Add(new SqlParameter() { ParameterName = parameterName, Value = keyVal.Value });
                    sqlBuilder.AppendFormat("[{0}] = @{1}", colName, parameterName);
                }
                else
                    sqlBuilder.AppendFormat("[{0}] = NULL", colName);

                wroteSet = true;
            }

            sqlQueryData.QueryString = sqlBuilder.ToString();
            return sqlQueryData;
        }


        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            if (source == null || action == null || (source != null && source.Count() == 0))
                return;

            //Parallel.ForEach(source, (element) => { action(element); });
            foreach (var element in source)
            {
                action(element);
            }

        }

        public static string ToTraceQuery<T>(this IQueryable<T> query)
        {
            ObjectQuery<T> objectQuery = GetQueryFromQueryable(query);

            var result = objectQuery.ToTraceString();
            foreach (var parameter in objectQuery.Parameters)
            {
                var name = "@" + parameter.Name;
                var value = "'" + parameter.Value.ToString() + "'";
                result = result.Replace(name, value);
            }

            return result;
        }

        public static string ToTraceString<T>(this IQueryable<T> query)
        {
            ObjectQuery<T> objectQuery = GetQueryFromQueryable(query);

            var traceString = new StringBuilder();

            traceString.AppendLine(objectQuery.ToTraceString());
            traceString.AppendLine();

            foreach (var parameter in objectQuery.Parameters)
            {
                traceString.AppendLine(parameter.Name + " [" + parameter.ParameterType.FullName + "] = " + parameter.Value);
            }

            return traceString.ToString();
        }
        private static System.Data.Entity.Core.Objects.ObjectQuery<T> GetQueryFromQueryable<T>(IQueryable<T> query)
        {
            var internalQueryField = query.GetType().GetFields(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance).Where(f => f.Name.Equals("_internalQuery")).FirstOrDefault();
            var internalQuery = internalQueryField.GetValue(query);
            var objectQueryField = internalQuery.GetType().GetFields(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance).Where(f => f.Name.Equals("_objectQuery")).FirstOrDefault();
            return objectQueryField.GetValue(internalQuery) as System.Data.Entity.Core.Objects.ObjectQuery<T>;
        }

        //Helper Extensions
        public static OrderDirection DecodeDirection(this string direction)
        {
            if (direction.ToLower().Trim() == "desc")
                return OrderDirection.DESC;

            return OrderDirection.ASC;
        }
        public static int ToInt(this string str)
        {
            return int.Parse(str);
        }

        public static bool ToBoolean(this int val)
        {
            return Convert.ToBoolean(val);
        }

        public static bool ToBoolean(this string str)
        {
            if (str.Trim() == "1" || str.Trim().ToLower() == "true" || str.Trim().ToLower() == "t")
            {
                str = bool.TrueString;
                return bool.Parse(str);
            }
            else
            {
                str = bool.FalseString;
                return bool.Parse(str);
            }
        }

        public static string Join(this IEnumerable<object> IList, string delimiter)
        {
            return String.Join(delimiter, IList);
        }

        public static string FixPhrase(this string value)
        {
            if (string.IsNullOrEmpty(value))
                return value;

            value = value + "-PHIFIX-";

            return value;
        }

        public static byte[] ReadToEnd(this System.IO.Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }

        //public static T Clone<T>(this T source)
        //{
        //    // Don't serialize a null object, simply return the default for that object
        //    if (source == null)
        //    {
        //        return default(T);
        //    }

        //    // initialize inner objects individually
        //    // for example in default constructor some list property initialized with some values,
        //    // but in 'source' these items are cleaned -
        //    // without ObjectCreationHandling.Replace default constructor values will be added to result
        //    var deserializeSettings = new JsonSerializerSettings { ObjectCreationHandling = ObjectCreationHandling.Replace };

        //    return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(source), deserializeSettings);

        //}

        public static T ResetEntityBaseValues<T>(this T entity) where T : EntityBase
        {
            entity.Id = -1;

            entity.UpdateDate = null;
            entity.UpdatedBy = null;
            entity.DeleteDate = null;

            entity.State = BaseState.Added;

            return entity;
        }

        public static DateTime NextDays(this DateTime from, DayOfWeek dayOfWeek)
        {
            int start = (int)from.DayOfWeek;
            int target = (int)dayOfWeek;
            if (target <= start)
                target += 7;
            return from.AddDays(target - start);
        }
    }




    public class SqlQueryData
    {
        public string QueryString { get; set; }
        public Dictionary<string, object> Parameters { get; set; }
        public List<SqlParameter> SqlParameters { get; set; }

        public SqlQueryData()
        {
            Parameters = new Dictionary<string, object>();
            SqlParameters = new List<SqlParameter>();
        }
    }
}
