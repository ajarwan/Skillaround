using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO.Payment
{
    public class Charge
    {
        public string id { get; set; }
        public int amount { get; set; }
        public string currency { get; set; }
        public bool threeDSecure { get; set; }
        public bool save_card { get; set; }

        public Customer customer { get; set; }
        public ChargeSource source { get; set; }

        public string description { get; set; }

        public ChargeReceipt receipt { get; set; }

        public Card card { get; set; }

        public ChargeRedirect redirect { get; set; }
        
    }

    public class ChargeSource
    {
        public string id { get; set; }
    }

    public class ChargeReceipt
    {
        public bool email { get; set; }

        public bool sms { get; set; }

    }

    public class ChargeRedirect
    {
        public string url { get; set; }
    }


}
