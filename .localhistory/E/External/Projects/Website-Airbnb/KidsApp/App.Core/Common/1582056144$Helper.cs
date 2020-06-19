using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace App.Core
{
    public static class Helper
    {
        public static List<string> ToStringArray(string value, char splitter = ',')
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            return value.TrimEnd(splitter).Split(splitter).ToList();
        }
        public static List<int> ToIntArray(string value, char splitter = ',')
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            return value.Split(splitter).Select(x => x.ToInt()).ToList();
        }
        public static bool IsValidJson(this string stringValue)
        {
            if (string.IsNullOrWhiteSpace(stringValue))
            {
                return false;
            }

            var value = stringValue.Trim();

            if ((value.StartsWith("{") && value.EndsWith("}")) || //For object
                (value.StartsWith("[") && value.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JToken.Parse(value);
                    return true;
                }
                catch (JsonReaderException)
                {
                    return false;
                }
            }

            return false;
        }

        public static List<Guid> ToGuidList(string value, char splitter = ',')
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            return value.TrimEnd(splitter).Split(splitter).Select(a => new Guid(a)).ToList();
        }

        public static string Select(string ar, string en, LanguageEnum lang)
        {
            if (lang == LanguageEnum.Arabic)
            {
                if (!string.IsNullOrEmpty(ar))
                {
                    return ar;
                }

                return en;
            }
            else
            {
                if (!string.IsNullOrEmpty(en))
                {
                    return en;
                }

                return ar;

            }
        }

        public static string AddParameter(string url, string key, string value)
        {
            return url + key + value + "&&";
        }

        public static string BuildUrl(string url, Dictionary<string, string> urlParams)
        {
            bool firstKey = true;
            StringBuilder sb = new StringBuilder();

            foreach (KeyValuePair<string, string> entry in urlParams)
            {
                if (firstKey == true)
                {
                    sb.Append($"{url}?{entry.Key}={entry.Value}");
                    firstKey = false;
                    continue;
                }
                sb.Append($"&{entry.Key}={entry.Value}");
            }

            return sb.ToString();
        }

        public static string DecryptHash(string strEncrypted, string strKey)
        {
            try
            {
                if (strEncrypted != string.Empty && strEncrypted != null)
                {
                    // Work around to remove spaces, while generated encryption keys.              
                    var objDESCrypto = new TripleDESCryptoServiceProvider();

                    var objHashMD5 = new MD5CryptoServiceProvider();

                    byte[] byteHash, byteBuff;

                    string strTempKey = strKey;

                    byteHash = objHashMD5.ComputeHash(Encoding.ASCII.GetBytes(strTempKey));

                    objHashMD5 = null;

                    objDESCrypto.Key = byteHash;

                    objDESCrypto.Mode = CipherMode.ECB;

                    strEncrypted = strEncrypted.Replace(" ", "+");

                    byteBuff = Convert.FromBase64String(strEncrypted);

                    string strDecrypted =
                        Encoding.ASCII.GetString(
                            objDESCrypto.CreateDecryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));

                    objDESCrypto = null;

                    return strDecrypted;
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                return "Wrong Input. " + ex.Message;
            }
        }

        public static string EncryptHash(string strToEncrypt, string strKey)
        {
            try
            {
                if (strToEncrypt != string.Empty && strToEncrypt != null)
                {
                    var objDESCrypto = new TripleDESCryptoServiceProvider();

                    var objHashMD5 = new MD5CryptoServiceProvider();

                    byte[] byteHash, byteBuff;

                    string strTempKey = strKey;

                    byteHash = objHashMD5.ComputeHash(Encoding.ASCII.GetBytes(strTempKey));

                    objHashMD5 = null;

                    objDESCrypto.Key = byteHash;

                    objDESCrypto.Mode = CipherMode.ECB;

                    byteBuff = Encoding.ASCII.GetBytes(strToEncrypt);

                    return
                        Convert.ToBase64String(
                            objDESCrypto.CreateEncryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));
                }

                return string.Empty;
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }



 

        public static DateTime StringToDate(this string value)
        {
            return DateTime.Parse(value);
        }

        public static List<T> JsonToList<T>(this string value)
        {
            return (List<T>)JsonConvert.DeserializeObject(value, typeof(List<T>));
        }


        public static string DecodeFormValue(string name)
        {
            var HttpRequest = HttpContext.Current.Request;

            if (string.IsNullOrEmpty(HttpRequest.Form[name]))
                return null;
            return HttpRequest.RequestContext.HttpContext.Server.UrlDecode(HttpRequest.Form[name]);
        }

        public static bool IsImage(string fileName)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(ConfigurationManager.AppSettings["AllowedImagesExtension"]))
                return false;

            var type = System.IO.Path.GetExtension(fileName).ToLower().Replace(".", "");

            List<string> types = Helper.ToStringArray(ConfigurationManager.AppSettings["AllowedImagesExtension"]);

            foreach (string t in types)
            {
                if (t == type)
                    return true;
            }

            //types.foreach((t: any) => {
            //    if (t == type)
            //      return true;
            //});

            //for (int i=0 ; i<types.Count ; i++)
            //{
            //    if (types[i] == type)
            //        return true;
            //}

            return false;

        }

        
    }


}
