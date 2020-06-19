using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class SupplierActivityViewStatistics
    {
        public int ActivityId { get; set; }

        public int SystemUsersViewCount_List { get; set; }

        public int AnonymousUsersViewCount_List { get; set; }

        public int SystemUsersViewCount_Details { get; set; }

        public int AnonymousUsersViewCount_Details { get; set; }

    }
}
