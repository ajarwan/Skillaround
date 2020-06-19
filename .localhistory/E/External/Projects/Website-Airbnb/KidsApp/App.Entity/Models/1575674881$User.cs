using App.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class User : EntityBase
    {

        #region"----Properties----"
        public string Email { get; set; }
       // [JsonIgnore]
        public string PasswordHash { get; set; }

        public string Image { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? DOB { get; set; }

        public bool EmailConfirmed { get; set; }

        public bool IsActive { set; get; } = true;

        public bool IsOnline { set; get; }

        public SharedEnums.Gender? Gender { set; get; } = null;

        public bool IsSupplier { set; get; }

        public string PhoneNumber { set; get; }

        public string PlaceLocationId { set; get; }
        public string ProviderId { set; get; }

        public SharedEnums.LoginProvider LoginProvider { set; get; } = SharedEnums.LoginProvider.System;
        #endregion

        #region "----Navigation Properties----"
        public ICollection<UserDocument> Documents { set; get; }

        public ICollection<Review> Reviews { set; get; }

        public ICollection<Activity> Activities { set; get; }

        public ICollection<Booking> Bookings { set; get; }
        #endregion

        #region "----Not Mapped----"
        [NotMapped]
        public string FullName
        {
            get { return this.FirstName + " " + this.LastName; }
        }
        #endregion




    }
}
