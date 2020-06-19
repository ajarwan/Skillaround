using App.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class User : EntityBase
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public string Image { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? DOB { get; set; }

        public bool EmailConfirmed { get; set; }

        public bool IsActive { set; get; } = true;

    }
}
