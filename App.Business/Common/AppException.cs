using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Business
{
    public class AppException : Exception
    {
        public BusinessErrorCodes Code { get; set; }
        public string ErrorMessage { get; set; }
        public dynamic Items { get; set; }

        public AppException(BusinessErrorCodes Code, string ErrorMessageCode = null, dynamic items = null)
        {
            this.Code = Code;
            this.ErrorMessage = ErrorMessage;
            this.Items = items;
        }

        public enum BusinessErrorCodes
        {
            UserExisit = 1,
        }

        public dynamic GetErroResponse()
        {
            return new
            {
                Code = this.Code,
                ErrorMessage = this.ErrorMessage,
                Items = this.Items
            };
        }
    }
}
