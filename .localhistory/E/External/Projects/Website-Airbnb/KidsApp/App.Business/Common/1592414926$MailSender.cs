using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace App.Business
{
    public class MailSender
    {
        public static void SendEmail(string title, string body, string to)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient(ConfigurationManager.AppSettings["SMTPServer"].ToString()); //"smtp.gmail.com"

            mail.From = new MailAddress(ConfigurationManager.AppSettings["MailSenderName"].ToString());// "alijarwan90@gmail.com"
            mail.To.Add(to);
            mail.Subject = title;
            mail.Body = body;
            mail.IsBodyHtml = true;
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.Port = int.Parse(ConfigurationManager.AppSettings["SMTPPort"].ToString());
            SmtpServer.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["MailSenderName"].ToString()
                , ConfigurationManager.AppSettings["MailSenderPassword"].ToString());
            SmtpServer.EnableSsl = true;
            mail.BodyEncoding = Encoding.UTF8;

             
            SmtpServer.Send(mail);

        }
    }
}
