using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace App.Business
{
    public class MailSender
    {
        public static void SendEmail(string Msg)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

            mail.From = new MailAddress("alijarwan90@gmail.com");
            mail.To.Add("alijarwan90@gmail.com");
            mail.Subject = "Test Mail";
            mail.Body = "This is for testing SMTP mail from GMAIL";
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.Port = 587;
            SmtpServer.Credentials = new System.Net.NetworkCredential("alijarwan90@gmail.com", "silverchip@1");
            SmtpServer.EnableSsl = true;

            SmtpServer.Send(mail);

        }
    }
}
