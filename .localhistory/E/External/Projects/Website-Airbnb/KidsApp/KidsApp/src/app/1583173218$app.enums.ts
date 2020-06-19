export module AppEnums {

  export enum EndPoints {
    Main = 1
  }

  export enum LoginProvider {
    System = 1,
    Google = 2,
    Facebook = 3
  }

  export enum BusinessErrorCodes {
    UserExisit = 1,
  }

  export enum Gender {
    Male = 1,
    Female = 2
  }

  export enum DialogType {
    Warning = 1,
    Error = 2,
    Success = 3,
    Info = 4,
    Notification = 5
  }

  export enum TransportationFilter {
    All = 0,
    Available = 1,
    NotAvailable = 2
  }

  export enum Days {
    Sa = 1,
    Su = 2,
    Mo = 3,
    Tu = 4,
    We = 5,
    Th = 6,
    Fr = 7,
  }

  export enum DocumentType {
    GovermentId = 1,
    TradeLicence = 2,
    SignedDocument = 3,
    PersonalPhoto = 4,
    NOL = 5
  }

  export enum Modules {
    Users = 1,
    Supplier = 2,
    Admin = 3
  }

  export enum ActivityPostStatus {
    All = 0,
    Posted = 1,
    NotPosted = 2
  }

  export enum BaseState {
    Unchanged = 0,
    Added = 2,
    Modified = 4,
    Deleted = 8,
    RelationAdded = 16,
    RelationDeleted = 32
  }

  export enum PageMode {
    Add = 1,
    Edit = 2,
    RO = 3
  }

  export enum MasterSearch {
    SupplierActivitesSearch = 1,

  }

  export enum AttachmentLocationType {
    Users = 1,
    Activity = 2
  }

  export enum UserTypes {
    Normal = 1,
    IndividualSupplier = 2,
    CompanySupplier = 3,
    Manager = 4
  }

  export enum ActivationStatus {
    All = 0,
    Active = 1,
    InActive = 2
  }

  export enum BookingConfirmationStatus {
    All = 0,
    Pending = 1,
    Confirmed = 2,
    Cancelled = 3
  }

  export enum SeenStatus {
    All = 0,
    Seen = 1,
    NotSeen = 2
  }

  export enum NotificationType {
    All = 0,
    SystemNotification = 1,
    UserMessage = 2,
    ConnectRequest = 3,
    Booking = 4,
    ConnectRequestApproval = 5,
  }

  export enum AcceptStatus {
    Pending = 1,
    Accepted = 2,
    Rejected = 3
  }


  export enum TimePickerMode {
    HoursOnly = 1,
    MinsOnly = 2,
    HoursAndMins = 3
  }

  export enum HourMode {
    Twelve = 1,
    TwentyFour = 2
  }

  export enum StatisicType {
    All = 0,
    ActivityView = 1,
    UserAccess = 2
  }
}
