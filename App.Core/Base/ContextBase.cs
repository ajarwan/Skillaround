using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Base
{
    [DbConfigurationType(typeof(EntityFrameworkConfiguration))]
    public class ContextBase : DbContext
    {
        public ContextBase(string conn) : base(conn)
        {
            this.Configuration.ProxyCreationEnabled = false;
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            //Must Be Configurable
            this.Database.CommandTimeout = 300;
        }

        public QueryOptions options { set; get; }

    }

    public class EntityFrameworkConfiguration : DbConfiguration
    {
        public EntityFrameworkConfiguration()
        {
            AddInterceptor(new DBInterceptor());
            AddInterceptor(new DBTreeInterceptor());

        }
    }
}
