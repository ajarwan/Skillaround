using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Base
{

    public class BusinessBase<TEntity> where TEntity : EntityBase
    {

        protected RepositoryBase<TEntity> Repository;
        public UnitOfWork Unit;

        private ConcurrentDictionary<string, dynamic> _FlatQueue;
        private ConcurrentDictionary<string, dynamic> _FlatQueue2;
 
        public BusinessBase(RepositoryBase<TEntity> repository)
        {
            Repository = repository;
            Unit = repository.Unit;
        }
 

        public virtual TEntity FindById(int id, Expression<Func<TEntity, object>> Include = null, QueryOptions options = null)
        {
            return Repository.FindById(id, Include, options);
        }

        public virtual TEntity FindById(int id, List<string> Include, QueryOptions options = null)
        {
            return Repository.FindById(id, Include, options);
        }

        public virtual List<TEntity> FindAll(
            Expression<Func<TEntity, bool>> filter = null,
            List<OrderBy<TEntity>> orderBy = null,
            Pager pagerBy = null,
            Expression<Func<TEntity, object>> Include = null,
            QueryOptions options = null
        )
        {
            return Repository.FindAll(filter, orderBy, pagerBy, Include, options);
        }

        public virtual List<TEntity> FindAll(
           Expression<Func<TEntity, bool>> filter,
           string orderBy,
           Pager pagerBy,
           List<string> Include,
           QueryOptions options = null
       )
        {
            return Repository.FindAll(filter, orderBy, pagerBy, Include, options);
        }

        public virtual List<TEntity> FindAll(
         Expression<Func<TEntity, bool>> filter,
         List<OrderBy<TEntity>> orderBy,
         Pager pagerBy,
         List<string> Include,
         QueryOptions options = null
     )
        {
            return Repository.FindAll(filter, orderBy, pagerBy, Include, options);
        }

        public virtual Task<TEntity> FindById_Async(int id, Expression<Func<TEntity, object>> Includes = null, QueryOptions options = null)
        {
            //Unit.Logger.LogEntrance(this.ToString(), new List<KeyValuePair<string, object>>() { new KeyValuePair<string, object>("Id", id), new KeyValuePair<string, object>("Include", Include) });
            return Repository.FindById_Async(id, Includes, options);
        }

        public virtual Task<TEntity> FindById_Async(int id, List<string> Includes, QueryOptions options = null)
        {
            //Unit.Logger.LogEntrance(this.ToString(), new List<KeyValuePair<string, object>>() { new KeyValuePair<string, object>("Id", id), new KeyValuePair<string, object>("Include", Include) });
            return Repository.FindById_Async(id, Includes, options);
        }

        //public virtual Task<List<TEntity>> FindAll_Async
        //(
        //    Expression<Func<TEntity, bool>> filter = null,
        //    List<OrderBy<TEntity>> orderBy = null,
        //    Pager pagerBy = null,
        //     Expression<Func<TEntity, object>> Include = null,
        //     QueryOptions options = null
        //)
        //{
        //    return Repository.FindAll_Async(filter, orderBy, pagerBy, Include, options);
        //}

        public virtual Task<List<TEntity>> FindAll_Async
       (
           Expression<Func<TEntity, bool>> filter,
           string orderBy,
           Pager pagerBy,
           List<string> Include,
           QueryOptions options = null
       )
        {
            return Repository.FindAll_Async(filter, orderBy, pagerBy, Include, options);
        }

        public virtual Task<List<TEntity>> FindAll_Async
       (
           Expression<Func<TEntity, bool>> filter,
           List<OrderBy<TEntity>> orderBy,
           Pager pagerBy,
           List<string> Include,
           QueryOptions options = null
       )
        {
            return Repository.FindAll_Async(filter, orderBy, pagerBy, Include, options);
        }

        public virtual List<TEntity> AddUpdate(List<TEntity> entities, AddUpdateOptions options = null)
        {
            entities.ForEach((e) =>
            {
                this.ResolveDuplicateRefIssue(e);
            });
            return Repository.AddUpdate(entities, options);
        }

        public virtual TEntity AddUpdate(TEntity entity, AddUpdateOptions options = null)
        {
            this.ResolveDuplicateRefIssue(entity);
            return Repository.AddUpdate(entity, options);
        }

        public virtual void Delete(int id)
        {
            Repository.Delete(id);
        }
        public virtual void Delete(TEntity entity)
        {
            Repository.Delete(entity);
        }

        public virtual Task<int> Count_Async(Expression<Func<TEntity, bool>> filter, QueryOptions options = null)
        {
            return Repository.Count_Async(filter, options);
        }

        public virtual int Count(Expression<Func<TEntity, bool>> filter = null, QueryOptions options = null)
        {
            return Repository.Count(filter, options);
        }


      
        public int UpdateBatch(Expression<Func<TEntity, bool>> filter, Dictionary<string, string> updateProps, AddUpdateOptions options = null)
        {
            return Repository.UpdateBatch(filter, updateProps, options);
        }

        public int DeleteBatch(Expression<Func<TEntity, bool>> filter, AddUpdateOptions options = null)
        {
            return Repository.DeleteBatch(filter, options);
        }
 

        public void IncludeSingleProperties(object entity, ConcurrentQueue<string> properties)
        {
            Repository.IncludeSingleProperties(entity, properties);
        }


         public void ResolveDuplicateRefIssue(EntityBase entity)
        {
            _FlatQueue = new ConcurrentDictionary<string, dynamic>();
            _FlatQueue2 = new ConcurrentDictionary<string, dynamic>();
            ConcurrentDictionary<string, string> reflectorTree = new ConcurrentDictionary<string, string>();
            //reflectorTree.TryAdd(entity.GetType().FullName, entity.Id);

            _AddItemToFlatQueue(entity);
            _ScanGraph(entity, reflectorTree, false);

            if (_FlatQueue2 != null && _FlatQueue2.Count > 0)
            {
                reflectorTree = new ConcurrentDictionary<string, string>();
                _ScanGraph(entity, reflectorTree, true);
            }

        }

        public virtual List<int> FindAllAllowedUsers(string id)
        {
            return null;
        }

        private void _ScanGraph(EntityBase entity, ConcurrentDictionary<string, string> reflectorTree, bool forReplace)
        {
            ((dynamic)entity).IsScaned = true;

            string outVal;
            reflectorTree.TryAdd(entity.GetType().FullName, ((dynamic)entity).Id.ToString());

            //set UpdatedBy to null to overcome changing it after add the entity into the context issue
            //entity.GetType().GetProperty("UpdatedBy").SetValue(entity, null);

            PropertyInfo[] props = entity.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (props == null || (props != null && props.Length == 0))
            {
                reflectorTree.TryRemove(entity.GetType().FullName, out outVal);
                return;
            }

            //Single properties 
            List<PropertyInfo> singleObjects = (from PropertyInfo p in props where p.PropertyType.GetInterfaces().Any(i => i == typeof(EntityBase)) select p).ToList();
            //List properties 
            List<PropertyInfo> listObjects = (from PropertyInfo p in props where p.PropertyType.IsGenericType && p.PropertyType.GetInterface(typeof(IEnumerable<>).FullName) != null select p).ToList();

            //Single properties 
            foreach (PropertyInfo p in singleObjects)
            {
                EntityBase val = (EntityBase)p.GetValue(entity);
                if (val != null)
                {
                    if ((!forReplace && ((dynamic)val).IsScaned) || _IsCircular(val.GetType().FullName, ((dynamic)val).Id, reflectorTree))
                    {
                        continue;
                    }

                    if (!forReplace)
                    {
                        _AddItemToFlatQueue(val);
                    }
                    else
                    {
                        if (_FlatQueue2 != null)
                        {
                            dynamic item;
                            _FlatQueue2.TryGetValue(val.GetType().FullName + "," + ((dynamic)val).Id.ToString(), out item);
                            if (item != null)
                            {
                                if (p.CanWrite)
                                {
                                    p.SetValue(entity, item);
                                }
                            }
                        }
                    }

                    _ScanGraph(val, reflectorTree, forReplace);
                }
            }

            //List properties             
            foreach (PropertyInfo p in listObjects)
            {
                if (p.PropertyType.GetGenericArguments() != null && p.PropertyType.GetGenericArguments().Length > 0 && p.PropertyType.GetGenericArguments()[0].GetInterfaces().Any(i => i == typeof(EntityBase)))
                {
                    dynamic val = p.GetValue(entity);

                    if (val != null && val.Count > 0)
                    {
                        //exclude hashset
                        if (val.GetType().Name.Contains("HashSet"))
                        {
                            continue;
                        }

                        for (int i = 0; i < val.Count; i++)
                        {
                            EntityBase b = val[i];

                            if (b != null)
                            {
                                if ((!forReplace && ((dynamic)b).IsScaned) || _IsCircular(b.GetType().FullName, ((dynamic)b).Id, reflectorTree))
                                {
                                    continue;
                                }

                                if (!forReplace)
                                {
                                    _AddItemToFlatQueue(b);
                                }
                                else
                                {
                                    if (_FlatQueue2 != null)
                                    {
                                        dynamic item;
                                        _FlatQueue2.TryGetValue(b.GetType().FullName + "," + ((dynamic)b).Id.ToString(), out item);
                                        if (item != null)
                                        {
                                            val[i] = item;
                                            if (p.CanWrite)
                                            {
                                                p.SetValue(entity, val);
                                            }
                                        }

                                    }
                                }

                                _ScanGraph(b, reflectorTree, forReplace);
                            }
                        }

                    }

                }
            }


            reflectorTree.TryRemove(entity.GetType().FullName, out outVal);
            return;

        }

         

        private bool _IsHigherRank(EntityBase pre, EntityBase current)
        {
            if (current.State == BaseState.Deleted && pre.State != BaseState.Deleted)//since the delete rule them all
            {
                return true;
            }

            if (current.State == BaseState.Modified && (pre.State != BaseState.Modified && pre.State != BaseState.Deleted))
            {
                return true;
            }

            return false;

         }

        private bool _IsCircular(string type, object id, ConcurrentDictionary<string, string> reflectorTree)
        {
            if (reflectorTree.ContainsKey(type) && reflectorTree[type] == id.ToString())
            {
                return true;
            }

            return false;

        }

        private void _AddItemToFlatQueue(EntityBase entity)
        {
            if (isNew(entity))//this is a new object and it will not added to the refrence resolve process
            {
                return;
            }

            if (_FlatQueue == null)
            {
                _FlatQueue = new ConcurrentDictionary<string, dynamic>();
            }

            dynamic item;
            _FlatQueue.TryGetValue(entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString(), out item);
            if (item != null)
            {
                //if the item and the entity is equal this mean they are pointing to the same memory location
                if (item != entity)
                {
                    if (_IsHigherRank(item, entity))
                    {
                        _FlatQueue[entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString()] = entity;
                    }

                    // the second queue will have just any entity that will show up more than once in the graph
                    if (_FlatQueue2 == null)
                    {
                        _FlatQueue2 = new ConcurrentDictionary<string, dynamic>();
                    }

                    dynamic item1;
                    _FlatQueue2.TryGetValue(entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString(), out item1);
                    if (item1 != null)
                    {
                        //_FlatQueue2[entity.GetType().FullName + "," + entity.Id.ToString()] = entity;
                        _FlatQueue2[entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString()] = item;

                    }
                    else
                    {
                        //_FlatQueue2.TryAdd(entity.GetType().FullName + "," + entity.Id.ToString(), entity);
                        _FlatQueue2.TryAdd(entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString(), item);
                    }
                }

            }
            else
            {
                _FlatQueue.TryAdd(entity.GetType().FullName + "," + ((dynamic)entity).Id.ToString(), entity);
            }
        }

        private bool isNew(EntityBase entity)
        {
            if (
                  (((dynamic)entity).Id.GetType() == typeof(int) && Convert.ToInt32(((dynamic)entity).Id) == -1) ||
                  (((dynamic)entity).Id.GetType() == typeof(string) && ((dynamic)entity).Id.ToString() == string.Empty) ||
                  (((dynamic)entity).Id.GetType() == typeof(Guid) && ((dynamic)entity).Id.ToString() == Guid.Empty.ToString())
                )
                return true;

            return false;
        }

    }
}
