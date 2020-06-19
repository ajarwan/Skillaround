using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class ActivityMapMark
    {
        public int Id { get; set; }

        public decimal Lat { get; set; }

        public decimal Lng { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public string SupplierPhoneNumber { get; set; }

         
    }
}
