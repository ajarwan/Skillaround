﻿using App.Core;
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

        public string DescriptionAr { get; set; }

        public string DescriptionEn { get; set; }

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

        public bool IsActive { get; set; } = false;

        public int? SupplierId { get; set; }
        public int CategoryId { get; set; }

        public int? ThumbnailId { get; set; }

        public decimal Price { get; set; }

        public int Capacity { get; set; }

        public bool AtUserLocation { get; set; }

        public bool OnlineLocation { get; set; }

        public string SupplierName { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierPhoneNumber { get; set; }
        #endregion


        #region "----Navigation Properties----"
        public User Supplier { get; set; }

        public Category Category { get; set; }

        public ActivityDocument Thumbnail { get; set; }
        public ICollection<ActivityDocument> Documents { get; set; }

        public ICollection<Review> Reviews { get; set; }

        public ICollection<Booking> Bookings { get; set; }

        public ICollection<Statistic> Statistics { set; get; }

        #endregion


        #region "----Not Mapped----"
        [NotMapped]
        public string Title
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

        [NotMapped]
        public string Description
        {
            get
            {
                if (UnitOfWork.Language == LanguageEnum.Arabic)
                    return this.DescriptionAr;
                if (UnitOfWork.Language == LanguageEnum.English)
                    return this.DescriptionEn;

                return "";
            }
        }

        [NotMapped]
        public string LocationNameCalculated
        {
            get
            {
                if (this.AtUserLocation)
                    return Resources.KidsApp.AtUserLocation;
                else if (this.OnlineLocation)
                    return Resources.KidsApp.OnlineLocation;
                else
                    return this.LocationName;
            }
        }

        [NotMapped]
        public string SupplierNameV
        {
            get
            {
                if (this.SupplierId.HasValue)
                {
                    return this.Supplier != null ? this.Supplier.FullName : string.Empty;
                }
                else
                {
                    return this.SupplierName;
                }
            }
        }

        [NotMapped]
        public string SupplierEmailV
        {
            get
            {
                if (this.SupplierId.HasValue)
                {
                    return this.Supplier != null ? this.Supplier.Email : string.Empty;
                }
                else
                {
                    return this.SupplierEmail;
                }
            }
        }

        [NotMapped]
        public string SupplierPhoneNumberV
        {
            get
            {
                if (this.SupplierId.HasValue)
                {
                    return this.Supplier != null ? this.Supplier.PhoneNumber : string.Empty;
                }
                else
                {
                    return this.SupplierPhoneNumber;
                }
            }
        }
        #endregion





    }
}
