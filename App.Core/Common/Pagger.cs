using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core
{
    public class Pager
    {
        public int PageIndex { set; get; } = -1;
        public int PageSize { set; get; } = -1;
        public int TotalPages { set; get; } = -1;
        public int TotalRecords { set; get; } = -1;

    }
}
