using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using App.Business;
using App.Business.Core;
using App.Core;
using App.Entity.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RestSharp;
using Newtonsoft.Json;

namespace App.Test
{
    [TestClass]
    public class TestPaymentGateWay
    {
        [TestMethod]
        public void TestCreateTokenFromCard()
        {
            var card = new Card()
            {
                number = 4012000033330026,
                exp_month = 5,
                exp_year = 21,
                cvc = 100,
                name = "Test Name"
            };


            var CardTokenRequestBody = new CardTokenRequestBody()
            {
                card = card
            }

            var client = new RestClient("https://api.tap.company/v2/tokens");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", "Bearer sk_test_Z9aACyiv6sRGJLNnMtuI481z");
            request.AddParameter("application/json", JsonConvert.SerializeObject(card), ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
        }
    }
}


public class Card
{
    public Int64 number { get; set; }
    public int exp_month { get; set; }
    public int exp_year { get; set; }
    public int cvc { get; set; }
    public string name { get; set; }

}

public class CardTokenRequestBody
{
    public Card card { get; set; }
}