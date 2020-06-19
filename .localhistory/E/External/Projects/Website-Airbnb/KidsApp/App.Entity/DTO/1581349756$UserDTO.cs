﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.DTO
{
    public class UserDTO
    {
        public string Email { get; set; }
        public string Image { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? DOB { get; set; }

        public SharedEnums.Gender? Gender { set; get; } = null;
    }
}
