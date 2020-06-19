using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{

    public class EntityBase
    {
        [Key, Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }

        private DateTime? createDate;

        public DateTime CreateDate
        {
            set
            {
                createDate = value;
            }
            get
            {
                if (createDate.HasValue)
                    return createDate.Value;
                else
                    return DateTime.Now;
            }
        }
        public DateTime? UpdateDate { set; get; }
        public DateTime? DeleteDate { set; get; }
        public bool IsDeleted { set; get; }
        public int CreatedBy { set; get; }
        public int? UpdatedBy { set; get; } = null;
        public int? DeletedBy { set; get; } = null;

        [NotMapped]
        public bool IsScaned { set; get; }


        [NotMapped]
        public BaseState State { set; get; }
    }

    public enum BaseState
    {
        Unchanged = 0,
        Added = 2,
        Modified = 4,
        Deleted = 8,
        RelationAdded = 16,
        RelationDeleted = 32
    }
}
