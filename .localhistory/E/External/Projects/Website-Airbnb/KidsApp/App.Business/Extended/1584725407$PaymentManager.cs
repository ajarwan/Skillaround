using App.Entity.DTO.Payment;
using App.Entity.Models;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace App.Business.Extended
{
    public class PaymentManager
    {

        public Customer CreatePaymentCustomer(User user)
        {
            Customer cus = new Customer()
            {
                first_name = user.FirstName,
                last_name = string.IsNullOrEmpty(user.LastName) ? user.FirstName : user.LastName,
                email = user.Email,
                phone = user.PhoneNumber,
            };

            //Save Customer
            var client = new RestClient("https://api.tap.company/v2/customers");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", "Bearer sk_test_Z9aACyiv6sRGJLNnMtuI481z");
            request.AddParameter("application/json", JsonConvert.SerializeObject(cus), ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                return JsonConvert.DeserializeObject<Customer>(response.Content);
            }
            else
                return null;
        }

    }
}
