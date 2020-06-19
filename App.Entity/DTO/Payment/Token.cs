using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO.Payment
{
    public class Token
    {
        public string id { get; set; }
        public string client_ip { get; set; }
        public string created { get; set; }
        public bool live_mode { get; set; }
        public string type { get; set; }
        public bool used { get; set; }

    }
}
