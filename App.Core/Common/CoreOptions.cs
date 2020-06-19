using App.Core.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{

    public class AddUpdateOptions
    {
        public bool IncludeGraph { set; get; } = true;
        public bool IncludeAuditTrail { set; get; } = true;
        public bool IncludeIsDelete { set; get; } = true;

    }

    public class QueryOptions
    {
        public bool IncludeIsDelete { set; get; } = true;
        public bool AsNoTracking { set; get; } = true;

    }

    public class JsonAuditSerilizeOptions
    {
        public static JsonSerializerSettings GetForAudit()
        {
            return new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Include,
                MaxDepth = 2,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                ContractResolver = new CustomJsonResolver(),
                DateFormatString = ConfigurationManager.AppSettings["ApiDateFormatString"],
                ObjectCreationHandling = ObjectCreationHandling.Replace
            };
        }

        public static JsonSerializerSettings Get()
        {
            return new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                DateFormatString = ConfigurationManager.AppSettings["ApiDateFormatString"],
                ObjectCreationHandling = ObjectCreationHandling.Replace
            };
        }

    }



}
