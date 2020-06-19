using System;
using App.Core;
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

    }
}
