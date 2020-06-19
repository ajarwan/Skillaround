using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Common
{

    internal class CustomJsonResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty prop = base.CreateProperty(member, memberSerialization);

            if ((prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericArguments() != null &&
                prop.PropertyType.GetGenericArguments().Length > 0 &&
                prop.PropertyType.GetGenericArguments()[0].BaseType == typeof(EntityBase)) || prop.PropertyType == typeof(BaseState))
            {
                prop.ShouldSerialize = obj => false;
            }

            return prop;
        }

    }

    public class BooleanJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(bool) || objectType == typeof(bool?));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value != null)
            {
                switch (reader.Value.ToString().ToLower().Trim())
                {
                    case "true":
                    case "yes":
                    case "y":
                    case "1":
                        return true;
                    case "false":
                    case "no":
                    case "n":
                    case "0":
                        return false;
                    case "null":
                    case "":
                        return null;
                };
            }
            else
                return null;

            // If we reach here, we're pretty much going to throw an error so let's let Json.NET throw it's pretty-fied error message.
            return new JsonSerializer().Deserialize(reader, objectType);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
        }

    }

    public class RefJsonConverter : JsonConverter
    {
        private Dictionary<int, object> prevEntities = new Dictionary<int, object>();
        private bool ignoreFirstEntrance = true;
        public override bool CanConvert(Type objectType)
        {
            if (!ignoreFirstEntrance)
                return objectType.BaseType == typeof(EntityBase);
            else
            {
                ignoreFirstEntrance = false;
                return false;
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            object obj = new JsonSerializer().Deserialize(reader, objectType);
            if (obj != null)
            {
                if (prevEntities.ContainsKey(((EntityBase)obj).Id) && prevEntities[((EntityBase)obj).Id].GetType() == objectType)
                {
                    object pre = prevEntities[((EntityBase)obj).Id];
                    return pre;
                }
                else
                    prevEntities.Add(((EntityBase)obj).Id, obj);
            }
            return obj;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {

        }

    }

    public class ReferenceResolverJsonConverter : JsonConverter, IDisposable
    {
        private ConcurrentDictionary<string, object> prevEntities;
        private bool ignoreFirstEntrance;
        public override bool CanConvert(Type objectType)
        {
            if (!ignoreFirstEntrance)
                return objectType.BaseType == typeof(EntityBase);
            else
            {
                ignoreFirstEntrance = false;
                return false;
            }
        }

        public ReferenceResolverJsonConverter()
        {
            //if (System.Diagnostics.Debugger.IsAttached == false)
            //    System.Diagnostics.Debugger.Launch();

            prevEntities = new ConcurrentDictionary<string, object>();
            ignoreFirstEntrance = true;
        }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            object current = new JsonSerializer().Deserialize(reader, objectType);
            //we are excluded all added entities from this process -- so the added entity will return as is
            if (current != null && ((EntityBase)current).Id != -1)
            {
                EntityBase currentCasted = (EntityBase)current;
                string currentKey = currentCasted.Id.ToString() + "," + currentCasted.GetType().ToString();

                if (prevEntities.ContainsKey(currentKey))
                {
                    object pre = prevEntities[currentKey];

                    //check if the prev entity has the same state
                    if (isHigherRank((EntityBase)pre, currentCasted))
                        return pre;
                    else
                    {
                        //we need to replace all the properties (direct property) for the pre object with the new one in a current obj
                        return replace(pre, currentCasted);
                    }
                }
                else
                    prevEntities.TryAdd(currentKey, current);// the key must be unique
            }
            return current;
        }
        public override bool CanWrite { get { return false; } }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        private bool isHigherRank(EntityBase pre, EntityBase current)
        {
            if (pre.State == current.State)
                return true;

            if (pre.State == BaseState.Deleted)//since the delete rule them all
                return true;

            if (pre.State == BaseState.Modified && current.State != BaseState.Deleted)//since the delete rule them all
                return true;

            return false;
        }

        private object replace(object pre, EntityBase current)
        {
            PropertyInfo[] props = current.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo p in props)
            {
                if (p.CanWrite)
                {
                    if ((p.PropertyType.IsPrimitive || p.PropertyType.IsValueType || p.PropertyType.IsEnum))
                    {
                        pre.GetType().GetProperty(p.Name).SetValue(pre, p.GetValue(current));
                        continue;
                    }

                    if (p.PropertyType.BaseType != typeof(EntityBase) && !(p.PropertyType.IsGenericType && p.PropertyType.GetInterface(typeof(IEnumerable<>).FullName) != null))
                        pre.GetType().GetProperty(p.Name).SetValue(pre, p.GetValue(current));

                }
            }
            return pre;
        }

        public void Dispose()
        {
            prevEntities = new ConcurrentDictionary<string, object>();
            ignoreFirstEntrance = true;
        }
    }

}
