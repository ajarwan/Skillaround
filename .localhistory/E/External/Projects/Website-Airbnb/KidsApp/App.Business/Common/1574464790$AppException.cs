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
        public dynamic Data { get; set; }

        public AppException(BusinessErrorCodes Code, string ErrorMessageCode = null, dynamic data = null)
        {
            this.Code = Code;
            this.ErrorMessage = ErrorMessage;
            this.Data = data;
        }

        public enum BusinessErrorCodes
        {
        }
    }
}
