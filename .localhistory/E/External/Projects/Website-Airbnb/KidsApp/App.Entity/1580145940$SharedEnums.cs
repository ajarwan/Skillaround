using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entity
{
    public class SharedEnums
    {
        public enum Gender : int
        {
            Male = 1,
            Female = 2
        }

        public enum DocumentType : int
        {
            GovermentId = 1,
            TradeLicence = 2,
            SignedDocument = 3,
            PersonalPhoto = 4
        }

        public enum TransportationFilter : int
        {
            All = 0,
            Available = 1,
            NotAvailable = 2
        }

        public enum LoginProvider : int
        {
            System = 1,
            Google = 2,
            Facebook = 3
        }

        public enum ActivationStatus : int
        {
            All = 0,
            Active = 1,
            InActive = 2
        }

        public enum Days : int
        {
            Sa = 1,
            Su = 2,
            Mo = 3,
            Tu = 4,
            We = 5,
            Th = 6,
            Fr = 7,
        }

        public enum AcceptStatus : int
        {
            Pending = 1,
            Accepted = 2,
            Rejected = 2
        }



        public enum MessageType : int
        {
            Email = 1,
            SystemMessgae = 2
        }

        public enum UserPasswordStatus
        {
            Set = 1,
            Reset = 2
        }

        public enum ActivityPostStatus
        {
            All = 0,
            Posted = 1,
            NotPosted = 2
        }

    }
}
