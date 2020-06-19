using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO.Payment
{
    public class Card
    {
        public string id { get; set; }
        public string funding { get; set; }
        public string fingerprint { get; set; }
        public string brand { get; set; }
        public int exp_month { get; set; }
        public int exp_year { get; set; }
        public string last_four { get; set; }
        public string first_six { get; set; }

        public string name { get; set; }

        public string customer { get; set; }
    }
}
