using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity
{
    public class SharedEnums
    {
        public enum Gender : int
        {
            Male = 1,
            Female = 2
        }

        public enum DocumentType : int
        {
            GovermentId = 1,
            TradeLicence = 2,
            SignedDocument = 3
        }

        public enum TransportationFilter : int
        {
            All = 0,
            Available = 1,
            NotAvailable = 2
        }

        public enum LoginProvider : int
        {
            System = 1,
            Google = 2,
            Facebook = 3
        }
 



    }
}
