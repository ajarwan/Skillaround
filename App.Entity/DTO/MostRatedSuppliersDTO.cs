using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class MostRatedSuppliersDTO
    {
        public int UserId { get; set; }
        public int TotalRatesSum { get; set; }
        public int Count { get; set; }
        public string FullName { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
        public decimal AvgRate { get; set; }

        public SharedEnums.UserTypes UserType { get; set; }



    }
}
