using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Activity : EntityBase
    {

        #region "----Properties----"
        public string TitleAr { get; set; }

        public string TitleEn { get; set; }

        public string Description { get; set; }

        public string LocationName { get; set; }

        public string LocationId { get; set; }

        public decimal Lng { get; set; }

        public decimal Lat { get; set; }

        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }

        public DateTime? From { get; set; }

        public DateTime? To { get; set; }

        public bool Transportation { get; set; }
        public bool IsPosted { get; set; }

        public int SupplierId { get; set; }
        public int CategoryId { get; set; }

        public int? ThumbnailId { get; set; }

        public decimal Price { get; set; }

        public int Capacity { get; set; }
        #endregion


        #region "----Navigation Properties----"
        public User Supplier { get; set; }

        public Category Category { get; set; }

        public ActivityDocument Thumbnail { get; set; }
        public ICollection<ActivityDocument> Documents { get; set; }

        public ICollection<Review> Reviews { get; set; }

        public ICollection<Booking> Bookings { get; set; }


        #endregion


        #region "----Not Mapped----"
        [NotMapped]
        public string TitleAr
        {
            get
            {
                if (UnitOfWork.Language == LanguageEnum.Arabic)
                    return this.TitleAr;
                if (UnitOfWork.Language == LanguageEnum.English)
                    return this.TitleEn;

                return "";
            }
        }
        #endregion





    }
}
