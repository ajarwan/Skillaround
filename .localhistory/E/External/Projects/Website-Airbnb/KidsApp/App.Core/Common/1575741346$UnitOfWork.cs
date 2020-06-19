using App.Core.Base;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace App.Core
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        public ContextBase Context;
        public DbContextTransaction Transaction;
        public StringBuilder Script;

        public List<string> BatchIds { set; get; }

        private string username;
        public string UserName
        {
            set
            {
                username = value;

            }
            get { return username; }
        }
        public int UserId { set; get; }

        public int UserSecurityLevel { set; get; }

        public UnitOfWork(ContextBase context)
        {
            Init(context);
        }

        public UnitOfWork()
        {
            //Init(new EvventaContext());
        }
        public void Init(ContextBase context)
        {

            Context = context;
            Context.Database.Connection.Open();

        }
        public ContextBase GetContext()
        {
            return Context;
        }


        public void FlushChanges()
        {
            InitTransaction();
            Context.SaveChanges();
        }

        public void SaveChanges()
        {
            try
            {
                InitTransaction();

                FlushChanges();


                if (Transaction != null)
                {
                    Transaction.Commit();

                    // for another save if required.
                    Transaction = null;
                }

                //resolve IAuditTrailManager throw IOC


            }

            catch (Exception ex)
            {
                if (Transaction != null)
                {
                    Transaction.Rollback();

                }
                throw ex;
            }
            finally
            {
                //entity status cleanup
                var entries = Context.ChangeTracker.Entries();
                entries.Where(e => ((EntityBase)e.Entity).State != BaseState.Deleted && ((EntityBase)e.Entity).State != BaseState.Unchanged).ForEach(e => ((EntityBase)e.Entity).State = BaseState.Unchanged);
                //deattach deleted entries
                entries.Where(e => ((EntityBase)e.Entity).State == BaseState.Deleted).ForEach(e => e.State = EntityState.Detached);

            }
        }
        public void RollBack()
        {
            if (Transaction != null)
                Transaction.Rollback();
        }
        public void Dispose()
        {
            if (Transaction != null)
            {
                Transaction.Dispose();

            }
            if (Context != null)
            {
                Context.Database.Connection.Close();

                Context.Dispose();
                Context = null;
                //DbInterception.Remove(intercepter);
                //DbInterception.Remove(treeIntercepter);

            }
        }



        public static LanguageEnum Language { set; get; }

        public void ContextClean()
        {
            var entries = Context.ChangeTracker.Entries();
            entries.ForEach(e => e.State = EntityState.Detached);
        }

        internal void InitTransaction()
        {
            if (Transaction == null)
            {
                Transaction = Context.Database.BeginTransaction();
            }
        }
    }

    public enum LanguageEnum : int
    {
        Notset = 0,
        Arabic = 1,
        English = 2
    }
}
