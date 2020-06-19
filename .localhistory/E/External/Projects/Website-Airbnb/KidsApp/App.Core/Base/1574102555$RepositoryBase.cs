using EntityFramework.Extensions;
using EntityFramework.Mapping;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;


namespace App.Core.Base
{

    public class RepositoryBase<TEntity> where TEntity : EntityBase
    {
        protected DbSet<TEntity> dbSet;
        protected ContextBase Context;
        public UnitOfWork Unit;

        public RepositoryBase(IUnitOfWork uw)
        {
            Context = uw.GetContext();
            dbSet = uw.GetContext().Set<TEntity>();
            Unit = (UnitOfWork)uw;
        }

        public TEntity FindById(int id, Expression<Func<TEntity, object>> Include = null, QueryOptions options = null)
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            TEntity result = null;
            result = query.FirstOrDefault(x => x.Id == id);


            return result;
        }

        public TEntity FindById(int id, List<string> Include, QueryOptions options = null)
        {


            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true            
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);


            TEntity result = null;
            result = query.FirstOrDefault(x => x.Id == id);


            return result;
        }

        public List<TEntity> FindAll
        (
            Expression<Func<TEntity, bool>> filter = null,
            List<OrderBy<TEntity>> orderBy = null,
            Pagger paggerBy = null,
            Expression<Func<TEntity, object>> Include = null,
            QueryOptions options = null
        )
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true            
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null && orderBy.Count > 0)
                query = GetOrderByQuery(query, orderBy);

            query = GetPagerBy(query, paggerBy, orderBy);

            List<TEntity> results = query.ToList();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

            return results;
        }

        public List<TEntity> FindAll
        (
            Expression<Func<TEntity, bool>> filter,
            string orderBy,
            Pagger paggerBy,
            List<string> Include,
            QueryOptions options = null
        )
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true            
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);


            if (filter != null)
                query = query.Where(filter);

            if (!string.IsNullOrEmpty(orderBy))
                query = query.OrderBy(orderBy);


            query = GetPagerBy(query, paggerBy, orderBy);

            List<TEntity> results = query.ToList();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

            return results;
        }

        public List<TEntity> FindAll
        (
            Expression<Func<TEntity, bool>> filter,
            List<OrderBy<TEntity>> orderBy,
            Pagger paggerBy,
            List<string> Include,
            QueryOptions options = null
        )
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true            
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null && orderBy.Count > 0)
                query = GetOrderByQuery(query, orderBy);

            query = GetPagerBy(query, paggerBy, orderBy);


            List<TEntity> results = query.ToList();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

            return results;
        }

        public Task<TEntity> FindById_Async(int id, Expression<Func<TEntity, object>> Includes = null, QueryOptions options = null)
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Includes != null)
                query = GetAllInclude(query, Includes);

            Task<TEntity> result = null;
            result = query.FirstOrDefaultAsync(o => o.Id == id);

            return result;
        }

        public Task<TEntity> FindById_Async(int id, List<string> Includes, QueryOptions options = null)
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Includes != null)
                query = GetAllInclude(query, Includes);

            Task<TEntity> result = null;
            result = query.FirstOrDefaultAsync(o => o.Id == id);


            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return result;
        }

        public Task<List<TEntity>> FindAll_Async
        (
            Expression<Func<TEntity, bool>> filter = null,
            List<OrderBy<TEntity>> orderBy = null,
            Pagger paggerBy = null,
            Expression<Func<TEntity, object>> Include = null,
            QueryOptions options = null
        )
        {

            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null && orderBy.Count > 0)
                query = GetOrderByQuery(query, orderBy);

            query = GetPagerBy(query, paggerBy, orderBy);

            Task<List<TEntity>> results = query.ToListAsync();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

            return results;
        }


        public Task<List<TEntity>> FindAll_Async
        (
            Expression<Func<TEntity, bool>> filter,
            string orderBy,
            Pagger paggerBy,
            List<string> Include,
            QueryOptions options = null
        )
        {

            //initilize options if null
            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true            
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            if (filter != null)
                query = query.Where(filter);

            if (!string.IsNullOrEmpty(orderBy))
                query = query.OrderBy(orderBy);

            query = GetPagerBy(query, paggerBy, orderBy);

            Task<List<TEntity>> results = query.ToListAsync();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return results;
        }

        public Task<List<TEntity>> FindAll_Async
      (
          Expression<Func<TEntity, bool>> filter,
          List<OrderBy<TEntity>> orderBy,
          Pagger paggerBy,
          List<string> Include,
          QueryOptions options = null
      )
        {

            //initilize options if null
            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            IQueryable<TEntity> query;
            if (options.AsNoTracking)
                query = dbSet.AsNoTracking().AsQueryable<TEntity>();
            else
                query = dbSet.AsQueryable<TEntity>();

            if (Include != null)
                query = GetAllInclude(query, Include);

            if (filter != null)
                query = query.Where(filter);

            if (orderBy != null && orderBy.Count > 0)
                query = GetOrderByQuery(query, orderBy);

            query = GetPagerBy(query, paggerBy, orderBy);

            Task<List<TEntity>> results = query.ToListAsync();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return results;
        }


        public Task<int> Count_Async(Expression<Func<TEntity, bool>> filter, QueryOptions options = null)
        {

            IQueryable<TEntity> query = dbSet.AsNoTracking().AsQueryable<TEntity>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            //initilize options if null
            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            Task<int> results = query.Select(x => x.Id).CountAsync();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return results;
        }

        public int Count(Expression<Func<TEntity, bool>> filter, QueryOptions options = null)
        {

            IQueryable<TEntity> query = dbSet.AsNoTracking().AsQueryable<TEntity>();

            if (filter != null)
                query = query.Where(filter);


            //initilize options if null
            if (options == null)
                options = new QueryOptions();//by default includeIsDelete are set to true
            Context.options = options;

            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            int results = query.Select(x => x.Id).Count();
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return results;
        }

        public TEntity AddUpdate(TEntity entity, AddUpdateOptions options = null)
        {

            // EV_TEMP_FIX
            if (Unit.UserId == 0)
                Unit.UserId = 1;

            // we can't change the state of null entity
            if (entity == null)
                return entity;

            //initilize options if null
            if (options == null)
                options = new AddUpdateOptions();//by default IncludeGraph,includeAuditTrail are set to true


            // assume the entity in the add state
            this.Unit.Context.Entry(entity).State = EntityState.Added;

            // all items in the added state in the graph

            //var entries = Context.ChangeTracker.Entries<EntityBase>().Where(x => x.State != EntityState.Detached); //.Reverse();
            //entries = entries.Reverse();

            var entries = this.Unit.Context.ChangeTracker.Entries<EntityBase>().Reverse();
            foreach (var entry in entries)
            {

                if (!options.IncludeGraph && entity != entry.Entity)
                {
                    entry.State = EntityState.Detached;
                    continue;
                }

                if (isNew(entry.Entity))
                {
                    entry.Entity.State = BaseState.Added;
                    entry.Entity.CreatedBy = Unit.UserId;

                    //find any sequence and set it's value

                    this.Unit.Context.ChangeTracker.DetectChanges();

                    //// we check if the state doen't have RelationAdd State
                    //if (entry.Entity.State == BaseState.Unchanged)
                    //    entry.Entity.State = BaseState.Added;


                    //AuditTail 
                    if (options.IncludeAuditTrail)
                    {
                        //AddAuditTrail(entry.Entity, AuditOperation.Added);
                    }
                }
                else
                {
                    //replaced by ResolveDuplicateRefIssue
                    //check and duplicated entity with the same PK
                    if (options.IncludeGraph)
                    {
                        if (deAttachDuplicatedEntity(entry))
                        {
                            continue;
                        }
                    }
                    //entry.Reference("").Query().AsNoTracking().AsQueryable().

                    if (entry.Entity.State.HasFlag(BaseState.Modified))
                    {
                        entry.State = EntityState.Modified;
                        entry.Property(x => x.CreateDate).IsModified = false;
                        entry.Property(x => x.CreatedBy).IsModified = false;

                        entry.Entity.UpdatedBy = Unit.UserId;
                        entry.Entity.UpdateDate = DateTime.Now;
                        this.Unit.Context.ChangeTracker.DetectChanges();




                        //AuditTail 
                        if (options.IncludeAuditTrail)
                        {
                            // AddAuditTrail(entry.Entity, AuditOperation.Modified);
                        }
                    }
                    else
                    {
                        if (entry.Entity.State.HasFlag(BaseState.Deleted))
                        {
                            entry.State = EntityState.Unchanged;

                            entry.Property(e => e.IsDeleted).IsModified = true;
                            entry.Property(e => e.DeletedBy).IsModified = true;
                            entry.Property(e => e.DeleteDate).IsModified = true;

                            entry.Entity.DeletedBy = Unit.UserId;
                            entry.Entity.IsDeleted = true;
                            entry.Entity.DeleteDate = DateTime.Now;

                            this.Unit.Context.ChangeTracker.DetectChanges();





                            //AuditTail 
                            if (options.IncludeAuditTrail)
                            {
                                // AddAuditTrail(entry.Entity, AuditOperation.Deleted);
                            }
                        }
                        else
                        {
                            entry.State = EntityState.Unchanged;
                            this.Unit.Context.ChangeTracker.DetectChanges();
                            entry.State = EntityState.Unchanged;

                        }
                    }
                }
            }


            //all added relationships  from EF without entity represenation / with out of the box manay to many relationship
            //var relations = this.Unit.Context.GetAddedRelationships();
            //if (relations != null && relations.Count() > 0)
            //{
            //    foreach (var rel in relations)
            //    {
            //        EntityBase<T> target = (EntityBase<T>)rel.Item2;

            //        if (target.Id != -1 && !target.State.HasFlag(BaseState.RelationAdded) && !target.State.HasFlag(BaseState.RelationDeleted))//target item                    
            //        {
            //            rel.Item3.ChangeState(EntityState.Unchanged);
            //        }
            //        else
            //        {
            //            if (target.State.HasFlag(BaseState.RelationDeleted))//target item                    
            //            {
            //                rel.Item3.ChangeState(EntityState.Deleted);
            //                //AuditTail 
            //                AddAuditTrail(target, AuditOperation.Deleted);
            //            }
            //            else
            //            {
            //                //AuditTail 
            //                AddAuditTrail(target, AuditOperation.Added);
            //            }
            //        }
            //    }
            //}

            return entity;

        }

        public List<TEntity> AddUpdate(List<TEntity> entities, AddUpdateOptions options = null)
        {
            entities.ForEach((e) => { AddUpdate(e, options); });
            return entities;
        }


        public void Delete(int id)
        {
            TEntity entity = (TEntity)new EntityBase();
            entity.Id = id;

            dbSet.Attach(entity);
            this.Unit.Context.Entry(entity).State = EntityState.Deleted;
        }

        public void Delete(TEntity entity)
        {
            var entries = this.Unit.Context.ChangeTracker.Entries<EntityBase>();
            dynamic result = null;
            if (entity.Id.GetType() == typeof(int))
                entries.Where(e => Convert.ToInt32(e.Entity.Id) == Convert.ToInt32(entity.Id) && e.Entity.GetType().AssemblyQualifiedName == entity.GetType().AssemblyQualifiedName).ToList();
            if (entity.Id.GetType() == typeof(Guid) || entity.Id.GetType() == typeof(string))
                entries.Where(e => e.Entity.Id.ToString() == entity.Id.ToString() && e.Entity.GetType().AssemblyQualifiedName == entity.GetType().AssemblyQualifiedName).ToList();


            if (result != null && result.Count > 0)
            {
                dbSet.Remove(entity);
            }
            else
            {
                dbSet.Attach(entity);
                dbSet.Remove(entity);
            }
        }

        public IQueryable<TEntity> GetOrderByQuery(IQueryable<TEntity> query, List<OrderBy<TEntity>> orderBy)
        {

            int index = 0;
            foreach (var order in orderBy)
            {
                if (!string.IsNullOrEmpty(order.OrderStr))
                {
                    if (index == 0)
                    {
                        query = query.OrderBy(order.OrderStr);
                    }
                    else
                    {
                        //NOTE: the below dose not handle the child properties i.e. x.Country.'Name'
                        OrderDirection direction = OrderDirection.ASC;
                        var orders = order.OrderStr.Trim().Split(' ').ToList();
                        if (orders.Count > 1)
                        {
                            if (orders[1].ToLower().Trim() == "desc")
                            {
                                direction = OrderDirection.DESC;
                            }
                            else if (orders[1].ToLower().Trim() == "asc")
                            {
                                direction = OrderDirection.ASC;
                            }
                        }

                        var entityType = typeof(TEntity);
                        var propertyInfo = entityType.GetProperty(orders[0]);
                        ParameterExpression arg = Expression.Parameter(entityType, "x");
                        MemberExpression property = Expression.Property(arg, orders[0]);

                        LambdaExpression orderExp;

                        if (propertyInfo.PropertyType == typeof(int))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, int>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, int>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, int>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(float))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, float>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, float>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, float>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(double))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, double>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, double>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, double>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(bool))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, bool>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, bool>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, bool>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(DateTime))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, DateTime>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, DateTime>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, DateTime>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(DateTime?))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, DateTime?>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, DateTime?>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, DateTime?>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(string))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, string>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, string>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, string>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(TimeSpan))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, TimeSpan>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, TimeSpan>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, TimeSpan>>)orderExp);
                        }
                        else if (propertyInfo.PropertyType == typeof(TimeSpan?))
                        {
                            orderExp = Expression.Lambda<Func<TEntity, TimeSpan?>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, TimeSpan?>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, TimeSpan?>>)orderExp);
                        }
                        else
                        {
                            orderExp = Expression.Lambda<Func<TEntity, object>>(property, new ParameterExpression[] { arg });
                            if (direction == OrderDirection.ASC)
                                query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, object>>)orderExp);
                            else
                                query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, object>>)orderExp);
                        }
                    }
                }
                else
                {
                    switch (orderBy[index].Order.ReturnType.Name.ToLower())
                    {
                        case "int32":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    //x=> x.CreateDate
                                    query = query.OrderBy((Expression<Func<TEntity, int>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, int>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, int>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, int>>)orderBy[index].Order);
                                }
                            }

                            break;

                        case "float":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, float>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, float>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, float>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, float>>)orderBy[index].Order);
                                }
                            }

                            break;

                        case "double":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, double>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, double>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, double>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, double>>)orderBy[index].Order);
                                }
                            }

                            break;

                        case "boolean":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, bool>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, bool>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, bool>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, bool>>)orderBy[index].Order);
                                }
                            }
                            break;
                        case "datetime":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, DateTime>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, DateTime>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, DateTime>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, DateTime>>)orderBy[index].Order);
                                }
                            }
                            break;

                        case "string":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, string>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, string>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, string>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, string>>)orderBy[index].Order);
                                }
                            }
                            break;
                        case "int64":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, Int64>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, Int64>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, Int64>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, Int64>>)orderBy[index].Order);
                                }
                            }
                            break;
                        case "timespan":
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, TimeSpan>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, TimeSpan>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, TimeSpan>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, TimeSpan>>)orderBy[index].Order);
                                }
                            }
                            break;
                        default:
                            if (index == 0)
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = query.OrderBy((Expression<Func<TEntity, object>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = query.OrderByDescending((Expression<Func<TEntity, object>>)orderBy[index].Order);
                                }
                            }
                            else
                            {
                                if (orderBy[index].Direction == OrderDirection.ASC)
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenBy((Expression<Func<TEntity, object>>)orderBy[index].Order);
                                }
                                else
                                {
                                    query = ((IOrderedQueryable<TEntity>)query).ThenByDescending((Expression<Func<TEntity, object>>)orderBy[index].Order);
                                }
                            }
                            break;
                    }
                }


                index += 1;
            }

            return query;

        }

        public IQueryable<TEntity> GetAllInclude
        (IQueryable<TEntity> query, Expression<Func<TEntity, object>> includeProperties)
        {

            List<string> includespaths = ExpressionAccessor<TEntity, object>.GetPaths(includeProperties).ToList();


            return includespaths.Aggregate
              (query, (current, path) => current.Include(path).AsNoTracking());

        }

        public IQueryable<TEntity> GetAllInclude(IQueryable<TEntity> query, List<string> includespaths)
        {
            return includespaths.Where(s => !string.IsNullOrEmpty(s)).Aggregate
              (query, (current, path) => current.Include(path).AsNoTracking());
        }

        public IQueryable<TEntity> GetPagerBy(IQueryable<TEntity> query, Pagger pager, List<OrderBy<TEntity>> orderBy)
        {
            if (pager != null && pager.PageIndex > 0 && pager.PageSize > 0)
            {
                pager.TotalRecords = query.Select(x => x.Id).Count();
                pager.TotalPages = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(pager.TotalRecords) / Convert.ToDouble(pager.PageSize)));
                if (orderBy == null || orderBy.Count == 0)
                {
                    query = query.OrderBy(o => o.Id);
                }

                int skip = (pager.PageIndex - 1) * pager.PageSize;
                query = query.Skip(() => skip).Take(() => pager.PageSize);

            }

            return query;
        }

        public IQueryable<TEntity> GetPagerBy(IQueryable<TEntity> query, Pagger pager, string orderBy)
        {
            if (pager != null && pager.PageIndex > 0 && pager.PageSize > 0)
            {
                pager.TotalRecords = query.Select(x => x.Id).Count();
                pager.TotalPages = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(pager.TotalRecords) / Convert.ToDouble(pager.PageSize)));
                if (string.IsNullOrEmpty(orderBy))
                {
                    query = query.OrderBy(o => o.Id);
                }

                int skip = (pager.PageIndex - 1) * pager.PageSize;
                query = query.Skip(() => skip).Take(() => pager.PageSize);

            }

            return query;
        }

        private bool deAttachDuplicatedEntity(DbEntityEntry<EntityBase> entry)
        {
            //var objectContext = ((IObjectContextAdapter)Context).ObjectContext;

            //objectContext.CreateEntityKey
            var entries = this.Unit.Context.ChangeTracker.Entries<EntityBase>();
            if (entries != null && entries.Count() > 0)
            {
                //List<DbEntityEntry<EntityBase>> items = (from DbEntityEntry<EntityBase> ent in entries where ent.Entity.Id == entry.Entity.Id && ent.Entity.GetType() == entry.Entity.GetType() select ent).ToList();

                var entity = entry.Entity;
                dynamic result = null;
                if (((dynamic)entity).Id.GetType() == typeof(int))
                    result = entries.Where(e => e.Entity.GetType() == entity.GetType() && Convert.ToInt32(e.Entity.Id) == Convert.ToInt32(((dynamic)entity).Id)).ToList();
                if (((dynamic)entity).Id.GetType() == typeof(Guid) || ((dynamic)entity).Id.GetType() == typeof(string))
                    result = entries.Where(e => e.Entity.GetType() == entity.GetType() && e.Entity.Id.ToString() == ((dynamic)entity).Id.ToString()).ToList();

                if (result != null && result.Count > 1 && entry.Entity.State == BaseState.Unchanged)
                {
                    entry.State = EntityState.Detached;
                    return true;
                }
            }
            return false;
        }

        public int UpdateBatch(Expression<Func<TEntity, bool>> filter, Dictionary<string, string> updateProps, AddUpdateOptions options = null)
        {
            Unit.InitTransaction();

            string batchId = string.Empty;
            string tableName = string.Empty;

            //initilize options if null
            if (options == null)
                options = new AddUpdateOptions();//by default IncludeGraph,includeAuditTrail are set to true
            Context.options = new QueryOptions() { IncludeIsDelete = options.IncludeIsDelete };


            //Unit.IncludeIsDelete = options.IncludeIsDelete;
            //audit Step
            //if (options.IncludeAuditTrail)
            //    auditUpdateBatch(filter, AuditOperation.Modified, ref batchId, ref tableName, options);

            if (updateProps.ContainsKey("UpdatedBy"))
                updateProps["UpdatedBy"] = Unit.UserId.ToString();
            else
                updateProps.Add("UpdatedBy", Unit.UserId.ToString());

            if (updateProps.ContainsKey("UpdateDate"))
                updateProps["UpdateDate"] = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss.fff");
            else
                updateProps.Add("UpdateDate", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss.fff"));

            int count = processUpdateBatch(filter, updateProps, options);

            //complete audit Steps - to serilize the new entity 
            //if (options.IncludeAuditTrail && !string.IsNullOrEmpty(batchId))
            //    auditUpdateBatchFinal(batchId, tableName);
            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return count;
        }


        public int DeleteBatch(Expression<Func<TEntity, bool>> filter, AddUpdateOptions options = null)
        {
            Unit.InitTransaction();

            string batchId = string.Empty;
            string tableName = string.Empty;

            //initilize options if null
            if (options == null)
                options = new AddUpdateOptions();//by default IncludeGraph,includeAuditTrail are set to true
            Context.options = new QueryOptions() { IncludeIsDelete = options.IncludeIsDelete };
            //Unit.IncludeIsDelete = options.IncludeIsDelete;

            //audit Step
            //if (options.IncludeAuditTrail)
            //    auditUpdateBatch(filter, AuditOperation.Deleted, ref batchId, ref tableName, options);

            Dictionary<string, string> prop = new Dictionary<string, string>
            {
                { "IsDeleted", "true" },
                { "DeletedBy", Unit.UserId.ToString() },
                { "DeleteDate", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss.fff") }
            };

            int count = processUpdateBatch(filter, prop, options);

            //complete audit Steps - to serilize the new entity 
            //if (options.IncludeAuditTrail && !string.IsNullOrEmpty(batchId))
            //    auditUpdateBatchFinal(batchId, tableName);

            //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;
            return count;

        }

        //public void IncludeSingleProperties(object entity,List<string> properties, AddUpdateOptions options = null)
        //{
        //    if (entity != null)
        //    {
        //        if (!isAttached(entity))
        //            Context.Entry(entity).State = EntityState.Unchanged;

        //        //initilize options if null
        //        if (options == null)
        //            options = new Common.AddUpdateOptions();//by default IncludeGraph,includeAuditTrail are set to true

        //        Unit.IncludeIsDelete = options.IncludeIsDelete;
        //        foreach (string p in properties)
        //        {
        //            if (Context.Entry(entity).Reference(p).CurrentValue == null)
        //                Context.Entry(entity).Reference(p).Load();                   

        //        }

        //        Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

        //    }
        //}

        public void IncludeSingleProperties(object entity, ConcurrentQueue<string> properties, AddUpdateOptions options = null)
        {
            if (entity != null)
            {
                if (!isAttached(entity))
                    this.Unit.Context.Entry(entity).State = EntityState.Unchanged;

                //initilize options if null
                if (options == null)
                    options = new AddUpdateOptions();//by default IncludeGraph,includeAuditTrail are set to true
                Context.options = new QueryOptions() { IncludeIsDelete = options.IncludeIsDelete };

                //Unit.IncludeIsDelete = options.IncludeIsDelete;
                foreach (string p in properties)
                {
                    if (this.Unit.Context.Entry(entity).Reference(p).CurrentValue == null)
                    {
                        this.Unit.Context.Entry(entity).Reference(p).Load();
                    }
                }

                //Unit.IncludeIsDelete = Unit.DefaultIncludeIsDelete;

            }
        }

        private int processUpdateBatch(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, TEntity>> updateEntity, AddUpdateOptions options)
        {
            var objectContext = ((IObjectContextAdapter)this.Unit.Context).ObjectContext;

            var selectQuery = dbSet.Where(filter);
            var dbQuery = selectQuery as DbQuery<TEntity>;
            var objectQuery = dbQuery.ToObjectQuery();
            var entityMap = objectQuery.GetEntityMap<TEntity>();


            var selectQueryData = objectQuery.GetSelectQuery(entityMap);
            selectQueryData.QueryString = selectQueryData.QueryString;

            var updateQueryData = updateEntity.GetUpdateQuery(objectContext, entityMap);

            var sqlBuilder = new StringBuilder(updateQueryData.QueryString);
            sqlBuilder.AppendLine(" ");
            sqlBuilder.AppendFormat("FROM {0} AS j0 INNER JOIN (", entityMap.TableName);
            sqlBuilder.AppendLine();
            sqlBuilder.AppendLine(selectQueryData.QueryString);
            sqlBuilder.Append(") AS j1 ON (");

            bool wroteKey = false;
            foreach (var keyMap in entityMap.KeyMaps)
            {
                if (wroteKey)
                {
                    sqlBuilder.Append(" AND ");
                }

                sqlBuilder.AppendFormat("j0.[{0}] = j1.[{0}]", keyMap.ColumnName);
                wroteKey = true;
            }
            sqlBuilder.Append(")");

            var queryStr = sqlBuilder.ToString();
            var parameters = new List<SqlParameter>();
            parameters.AddRange(selectQueryData.SqlParameters);
            parameters.AddRange(updateQueryData.SqlParameters);

            try
            {
                //Logger
                int count = this.Unit.Context.Database.ExecuteSqlCommand(queryStr, parameters.ToArray());

                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private int processUpdateBatch(Expression<Func<TEntity, bool>> filter, Dictionary<string, string> updateProps, AddUpdateOptions options)
        {
            var objectContext = ((IObjectContextAdapter)this.Unit.Context).ObjectContext;
            var selectQuery = dbSet.Where(filter);
            var dbQuery = selectQuery as DbQuery<TEntity>;
            var objectQuery = dbQuery.ToObjectQuery();
            var entityMap = objectQuery.GetEntityMap<TEntity>();

            var selectQueryData = objectQuery.GetSelectQuery(entityMap);
            selectQueryData.QueryString = selectQueryData.QueryString;


            var updateQueryData = updateProps.GetUpdateQuery(objectContext, entityMap);

            var sqlBuilder = new StringBuilder(updateQueryData.QueryString);
            sqlBuilder.AppendLine(" ");
            sqlBuilder.AppendFormat("FROM {0} AS j0 INNER JOIN (", entityMap.TableName);
            sqlBuilder.AppendLine();
            sqlBuilder.AppendLine(selectQueryData.QueryString);
            sqlBuilder.Append(") AS j1 ON (");

            bool wroteKey = false;
            foreach (var keyMap in entityMap.KeyMaps)
            {
                if (wroteKey)
                {
                    sqlBuilder.Append(" AND ");
                }

                sqlBuilder.AppendFormat("j0.[{0}] = j1.[{0}]", keyMap.ColumnName);
                wroteKey = true;
            }
            sqlBuilder.Append(")");

            var queryStr = sqlBuilder.ToString();
            var parameters = new List<SqlParameter>();
            parameters.AddRange(selectQueryData.SqlParameters);
            parameters.AddRange(updateQueryData.SqlParameters);

            try
            {
                //Logger
                int count = this.Unit.Context.Database.ExecuteSqlCommand(queryStr, parameters.ToArray());

                return count;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private bool isAttached(object entity)
        {
            var entries = this.Unit.Context.ChangeTracker.Entries();

            //if (entries.Any(e=> ((EntityBase)e.Entity).Id == ((EntityBase)entity).Id && entity.GetType() ==e.Entity.GetType() ))            
            //    return true;
            if (entries.Any(e => ((EntityBase)e.Entity) == entity))
            {
                return true;
            }

            return false;
        }


        private bool isNew(EntityBase entity)
        {
            if (entity.Id < 1)
                return true;

            return false;
        }
    }
}
