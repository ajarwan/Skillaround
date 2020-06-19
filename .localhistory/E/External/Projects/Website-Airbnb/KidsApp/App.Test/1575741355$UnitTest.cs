using System;
using System.Collections.Generic;
using App.Business.Core;
using App.Core;
using App.Entity.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace App.Test
{
    [TestClass]
    public class UnitTest
    {
        [TestMethod]
        public void TestEncryption()
        {

            var res = Helper.EncryptHash("Ali123", "123123123");

            Console.WriteLine(res);

            var res1 = Helper.DecryptHash(res, "123123123");

            Console.WriteLine(res1);

        }

        [TestMethod]
        public void TestHashing()
        {

            //var res = Helper.EncryptHash("Ali123", "123123123");

            //Console.WriteLine(res);

            //var res1 = Helper.DecryptHash(res, "123123123");

            var res = Helper.EncryptHash("Vh7H5+qjuBg", "rOsciOiCpJo2P4uBQsK4D52EXXSfjPlTwijw3o8h62k");


            Console.WriteLine(res);

        }


        [TestMethod]
        public void AddSomeCategories()
        {
            using (var Unit = new UnitOfWork())
            {
                Manager<Category> Mgr = new Manager<Category>(Unit);

                var Cat1 = new Category()
                {
                    TitleAr = "التعليم",
                    TitleEn = "Education",
                    IsActive = true
                };

                var Cat2 = new Category()
                {
                    TitleAr = "كرة القدم",
                    TitleEn = "Football",
                    IsActive = true
                };

                Mgr.AddUpdate(new List<Category>() { Cat1, Cat2 });
                Unit.SaveChanges();
            }


        }

    }
}
