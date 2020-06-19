using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class FileDTO
    {
        public string File { get; set; }
        public string Ext { get; set; }
        public SharedEnums.AttachmentLocationType Type { get; set; }
    }
}
