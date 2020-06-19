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


namespace App.Test
{
    [TestClass]
    class TestPAymentGateWay
    {
        [TestMethod]
        public void TestCreateTokenFromCard()
        {


        }
    }
}


public class card
{
    public int number { get; set; }
    public int exp_month { get; set; }
    public int exp_year { get; set; }
    public int cvc { get; set; }
    public string name { get; set; }

}