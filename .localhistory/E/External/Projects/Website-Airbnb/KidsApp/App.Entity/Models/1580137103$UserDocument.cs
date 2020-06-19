using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class UserDocument : EntityBase
    {
        public UserDocument()
        {
            this.UpdateDate = this.CreateDate;
        }
        public SharedEnums.DocumentType DocumentType { get; set; }

        public string File { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string FileName { get; set; }

        public string FileSize { get; set; }
    }
}

