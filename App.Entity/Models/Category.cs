using App.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity.Models
{
    public class Category : EntityBase
    {
        #region "-----Properties-----"
        public string TitleAr { get; set; }
        public string TitleEn { get; set; }

        public string IconClass { get; set; }

        public bool IsActive { get; set; } = true;

        public string ImageName { get; set; }

        #endregion

        #region "----Navigation Properties----"
        public ICollection<Activity> Activities { get; set; }

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
        #endregion
    }
}
