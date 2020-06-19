using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{
    public class DBInterceptor : IDbCommandInterceptor
    {
        private const string PhrasePrefix = "-PHIFIX-";

        //private UnitOfWork UW;

        public DBInterceptor()
        {

        }

 
        public void NonQueryExecuted(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
             
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();

            //if (context != null && context.Logger != null)
            //    context.Logger.Info("Completed with result: NonQueryExecuted");

        }

        public void NonQueryExecuting(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            FixPhraseIndexing(command);

            
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();

            //if (context != null && context.Logger != null)
            //    context.Logger.DBLog(string.Format("{0}", command.CommandText), this.ToString(), command.Parameters);

        }

        public void ReaderExecuted(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        { 
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();
            //if (context != null && context.Logger != null)
            //    context.Logger.Info("Completed with result: SqlDataReader");

        }

        public void ReaderExecuting(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {

             
            FixPhraseIndexing(command);
 
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();

            //if (context != null && context.Logger != null)
            //    context.Logger.DBLog(string.Format("{0}", command.CommandText), this.ToString(), command.Parameters);


        }

        public void ScalarExecuted(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();
            //if (context != null && context.Logger != null)
            //    context.Logger.Info("Completed with result: ScalarExecuted");

        }

        public void ScalarExecuting(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            FixPhraseIndexing(command);

          
            var context = (ContextBase)interceptionContext.DbContexts.Where(c => typeof(ContextBase) == c.GetType().BaseType.BaseType).FirstOrDefault();
            //if (context != null && context.Logger != null)
            //    context.Logger.DBLog(string.Format("{0}", command.CommandText), this.ToString(), command.Parameters);

        }



        private void FixPhraseIndexing(DbCommand cmd)
        {
            if (cmd.Parameters != null && cmd.Parameters.Count > 0)
            {
                for (int i = 0; i < cmd.Parameters.Count; i++)
                {
                    var Param = cmd.Parameters[i];

                    if (Param.Value == DBNull.Value)
                        continue;

                    if (Param.DbType == DbType.String || Param.DbType == DbType.AnsiString || Param.DbType == DbType.AnsiStringFixedLength)
                    {
                        var value = (string)Param.Value;

                        if (value.Contains(PhrasePrefix) || value.Contains(PhrasePrefix.ToLower()))
                        {
                            value = value.Replace(PhrasePrefix, "");
                            value = value.Replace(PhrasePrefix.ToLower(), "");
                            value = value.Replace("~%", "%");
                            value = value.Replace("%~", "%");
                        }

                        Param.Value = value;
                    }
                }
            }
        }

    }

}
