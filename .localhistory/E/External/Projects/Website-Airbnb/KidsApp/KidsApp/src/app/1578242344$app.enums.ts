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
}
