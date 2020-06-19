using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public static string HashDecryption(string strEncrypted, string encryptionKey, SCTHSMSLanguage language)
        {
            var objDESCrypto = new TripleDESCryptoServiceProvider();

            var objHashMD5 = new MD5CryptoServiceProvider();

            byte[] byteHash, byteBuff;

            byteHash = language == SCTHSMSLanguage.English
                           ? objHashMD5.ComputeHash(Encoding.ASCII.GetBytes(encryptionKey))
                           : objHashMD5.ComputeHash(Encoding.UTF8.GetBytes(encryptionKey));

            objHashMD5 = null;

            objDESCrypto.Key = byteHash;

            objDESCrypto.Mode = CipherMode.ECB;

            byteBuff = Convert.FromBase64String(strEncrypted);

            string strDecrypted = language == SCTHSMSLanguage.English
                                      ? Encoding.ASCII.GetString(
                                          objDESCrypto.CreateDecryptor()
                                            .TransformFinalBlock(byteBuff, 0, byteBuff.Length))
                                      : Encoding.UTF8.GetString(
                                          objDESCrypto.CreateDecryptor()
                                            .TransformFinalBlock(byteBuff, 0, byteBuff.Length));

            objDESCrypto = null;

            return strDecrypted;
        }

        public static string HashEncryption(string strToEncrypt, string encryptionKey, SCTHSMSLanguage language)
        {
            var objDESCrypto = new TripleDESCryptoServiceProvider();

            var objHashMD5 = new MD5CryptoServiceProvider();

            byte[] byteHash, byteBuff;

            byteHash = language == SCTHSMSLanguage.English
                           ? objHashMD5.ComputeHash(Encoding.ASCII.GetBytes(encryptionKey))
                           : objHashMD5.ComputeHash(Encoding.UTF8.GetBytes(encryptionKey));

            objHashMD5 = null;

            objDESCrypto.Key = byteHash;

            objDESCrypto.Mode = CipherMode.ECB;

            byteBuff = language == SCTHSMSLanguage.English
                           ? Encoding.ASCII.GetBytes(strToEncrypt)
                           : Encoding.UTF8.GetBytes(strToEncrypt); // when it is arabic data utf8,english meansAscii

            return
                Convert.ToBase64String(objDESCrypto.CreateEncryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));
        }

        public static string EncryptParameter(string text, string ParameterKey, SCTHSMSLanguage language = SCTHSMSLanguage.English)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentNullException();
            }

            string encrypted = HashEncryption(text, ParameterKey, language);
            return Uri.EscapeDataString(encrypted);
        }

        public static string FilesToZip(string sourceFolder, List<string> files, string destinationFolder = null)
        {
            try
            {
                if (files.Count == 0)
                    throw new Exception("Please send a valid number of files to compress");
                string tempFolderName = Guid.NewGuid().ToString();
                string tempFolderPath = Path.Combine(sourceFolder, tempFolderName);
                // create temp folder
                Directory.CreateDirectory(tempFolderPath);

                // copy files to temp folder

                foreach (var attachment in files)
                {
                    string sourceFile = sourceFolder + "\\" + attachment;
                    if (File.Exists(sourceFile))
                    {
                        string destFile = tempFolderPath + "/" + attachment;
                        File.Copy(sourceFile, destFile, true);
                    }

                }
                // create zip file
                string compressedFileName = Guid.NewGuid().ToString() + ".zip";
                string compressedFilePath = tempFolderPath.Replace(tempFolderName, compressedFileName);
                ZipFile.CreateFromDirectory(tempFolderPath, compressedFilePath);
                Directory.Delete(tempFolderPath, true);
                // get url for compressed file (zip)
                return (!string.IsNullOrWhiteSpace(destinationFolder) ? destinationFolder : sourceFolder) +
                       compressedFileName;
                //string downloadUrl = Url.Content(resultRelativePath).Replace("/Api/Contacts/PassportAttachments/DownloadMultiple/~", "");

                // generate download name for the compressed file

            }
            catch (Exception ex)
            {
                throw new Exception("The following error for compressing file:" + ex.Message);
            }
        }

        public static FileResultType MapExtensionToType(string fileName)
        {
            string extension = System.IO.Path.GetExtension(fileName)?.ToLower();
            switch (extension)
            {
                case ".pdf":
                    return FileResultType.PDFContentResult;
                case ".docx":
                    return FileResultType.WordContentResult;
                case ".doc":
                    return FileResultType.WordContentResult;
                case ".png":
                    return FileResultType.ImageContentResult;
                case ".jpg":
                    return FileResultType.ImageContentResult;
                case ".jpeg":
                    return FileResultType.ImageContentResult;
                case ".zip":
                    return FileResultType.ZipContentResult;
                case ".txt":
                    return FileResultType.TextContentResult;
                case ".xlsx":
                    return FileResultType.ExcelContentResult;
                default:
                    return FileResultType.PDFContentResult;
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

        public static CookieHeaderValue BuildCookie(string key, string value, string url, bool rememberMe = false, string path = "/")
        {
            var cookie = new CookieHeaderValue(key, value);
            if (rememberMe)
                cookie.Expires = DateTimeOffset.Now.AddDays(5);
            cookie.Domain = url;
            cookie.Path = path + ";SameSite=Strict";
            cookie.HttpOnly = true;

            return cookie;
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

        public static byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }


}
