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
            PersonalPhoto = 4,
            NOL = 5
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
            Rejected = 3
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

        public enum AttachmentLocationType
        {
            Users = 1,
            Activity = 2
        }

        public enum UserTypes
        {
            All = 0,
            Normal = 1,
            IndividualSupplier = 2,
            CompanySupplier = 3,
            Manager = 4
        }


        public enum BookingConfirmationStatus
        {
            All = 0,
            Pending = 1,
            Confirmed = 2,
            Cancelled = 3
        }

        public enum SeenStatus : int
        {
            All = 0,
            Seen = 1,
            NotSeen = 2
        }

        public enum NotificationType : int
        {
            All = 0,
            SystemNotification = 1,
            UserMessage = 2,
            ConnectRequest = 3,
            Booking = 4,
            ConnectRequestApproval = 5,
        }


    }
}
