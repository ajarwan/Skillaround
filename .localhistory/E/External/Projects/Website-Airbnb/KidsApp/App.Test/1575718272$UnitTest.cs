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
    }
}
