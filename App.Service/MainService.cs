using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Configuration;
using App.Core;
using App.Business;

namespace App.Service
{
    partial class MainService : ServiceBase
    {
        Timer EmailsSenderJobTimer = new Timer();
        EmailsSenderJob ESJ = new EmailsSenderJob();
        public MainService()
        {
            InitializeComponent();
            EmailsSenderJobTimer = new Timer();
            ESJ = new EmailsSenderJob();
        }

        protected override void OnStart(string[] args)
        {
            using (UnitOfWork Unit = UOW.GetInstanceForJobs())
            {
                Unit.LogError(new Exception(" MainService Start"));
            }
            EmailsSenderJobTimer.Elapsed += new ElapsedEventHandler(ESJ.StartSending);
            EmailsSenderJobTimer.Interval = int.Parse(ConfigurationManager.AppSettings["EmailServiceTimer"].ToString());
            EmailsSenderJobTimer.Enabled = true;
            EmailsSenderJobTimer.Start();

        }

        protected override void OnStop()
        {
            // TODO: Add code here to perform any tear-down necessary to stop your service.
        }
    }
}
