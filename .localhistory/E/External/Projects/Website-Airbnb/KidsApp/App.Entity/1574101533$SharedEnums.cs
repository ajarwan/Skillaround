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
    }
}
