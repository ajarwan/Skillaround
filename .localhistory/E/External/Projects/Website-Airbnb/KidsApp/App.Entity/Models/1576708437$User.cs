﻿using App.Core;
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

        [JsonIgnore]
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

        public SharedEnums.Days SupplierStatrtWorkingDay { set; get; } = SharedEnums.Days.Su;
        public SharedEnums.Days SupplierEndWorkingDay { set; get; } = SharedEnums.Days.Th;

        public TimeSpan? StartWorkingTime { get; set; }
        public TimeSpan? EndWorkingTime { get; set; }

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

        [NotMapped]
        public string StartTimeFormatted
        {
            get
            {
                 
                if (!this.StartWorkingTime.HasValue)
                    return "";

                var am = UnitOfWork.Language == LanguageEnum.Arabic ? "ص" : "AM";
                var pm = UnitOfWork.Language == LanguageEnum.Arabic ? "م" : "PM";
                var hrs = StartWorkingTime.Value.Hours;
                var mins = StartWorkingTime.Value.Minutes;

                if (hrs >= 12)
                {
                    return (hrs - 12) + ":" + mins + (hrs >= 12 ? pm : am);
                }
                {
                    return hrs + ":" + mins + (hrs > 11 ? pm : am);

                }

            }

        }

        [NotMapped]
        public string EndTimeFormatted
        {
            get
            {

                if (!this.EndWorkingTime.HasValue)
                    return "";


                var am = UnitOfWork.Language == LanguageEnum.Arabic ? "ص" : "AM";
                var pm = UnitOfWork.Language == LanguageEnum.Arabic ? "م" : "PM";
                var hrs = EndWorkingTime.Value.Hours;
                var mins = EndWorkingTime.Value.Minutes;

                if (hrs >= 12)
                {
                    return (hrs - 12) + ":" + mins + (hrs >= 12 ? pm : am);
                }
                {
                    return hrs + ":" + mins + (hrs > 11 ? pm : am);

                }
            }

        }
 
      
        #endregion




    }
}
