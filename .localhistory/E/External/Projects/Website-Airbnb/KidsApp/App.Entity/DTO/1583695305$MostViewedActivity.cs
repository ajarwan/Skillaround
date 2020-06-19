using App.Entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class MostViewedActivity
    {
        public int Count { get; set; }
        public Activity Activity { get; set; }
    }
}
