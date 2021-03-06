﻿using App.Core;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class User : EntityBase, IPrincipal, IIdentity
    {

        #region"----Properties----"
        public string Email { get; set; }

        [JsonIgnore]
        public string PasswordHash { get; set; }

        public string Image { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? DOB { get; set; }


        public bool IsActive { set; get; } = true; // Activated- Deactivated By System Admin

        public bool EmailConfirmed { get; set; } //Confirmed By Link Sent by Email

        public bool IsSupplierVerified { get; set; } = false; //Verified By System Admin


        public SharedEnums.Gender? Gender { set; get; } = null;

        public bool IsSupplier { set; get; }

        public string PhoneNumber { set; get; }

        public string PlaceLocationId { set; get; }
        public string ProviderId { set; get; }

        public SharedEnums.LoginProvider LoginProvider { set; get; } = SharedEnums.LoginProvider.System;

        public Guid? UserUniqueId { get; set; } = null;

        public SharedEnums.UserPasswordStatus PasswordStatus { get; set; } = SharedEnums.UserPasswordStatus.Set;

        public SharedEnums.UserTypes UserType { get; set; } = SharedEnums.UserTypes.Normal;

        public DateTime? YearOfEstablishment { get; set; }
        public DateTime? LicenseExpiryDate { get; set; }

        public string Location { set; get; }

        public string LicenseNumber { set; get; }

        public string IdNumber { set; get; }

        public DateTime? LastActiveDate { set; get; }

        #endregion

        #region "----Navigation Properties----"
        public ICollection<UserDocument> Documents { set; get; }

        public ICollection<Review> Reviews { set; get; }

        public ICollection<Activity> Activities { set; get; }

        public ICollection<Booking> Bookings { set; get; }

        public ICollection<UserFriends> Friends { set; get; }

        [InverseProperty("Friend")]
        public ICollection<UserFriends> RelatedFriends { set; get; }

        public ICollection<Kid> Kids { set; get; }

        public ICollection<WorkingDay> WorkingDays { set; get; }

        public ICollection<Statistic> Statistics { set; get; }

        #endregion

        #region "----Not Mapped----"
        [NotMapped]
        public string FullName
        {
            get { return this.FirstName + " " + this.LastName; }
        }

        

       

        [NotMapped]
        public IIdentity Identity => this;
        [NotMapped]
        public string Name => this.Email;

        [NotMapped]
        public string AuthenticationType => "Berear";
        [NotMapped]
        public bool IsAuthenticated => true;
        public bool IsInRole(string role)
        {
            return true;
        }

        [NotMapped]
        public bool IsOnline
        {
            get
            {

                if (this.LastActiveDate == null || this.LastActiveDate.Value == null || this.LastActiveDate == new DateTime())
                    return false;

                TimeSpan ts = DateTime.Now - this.LastActiveDate.Value;

                if (ts.TotalMinutes < 5)
                    return true;

                return false;
            }

        }

        #endregion




    }
}
