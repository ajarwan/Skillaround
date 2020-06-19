export module CoreEnums {

  export enum StorageLocation {
    Memory = 1,
    LocalStorge = 2,
    Cookies = 3
  }

  export enum CharLimit {
    OnlyEnglish = 1,
    OnlyArabic = 2,
    OnlyNumbers = 3,
    PositiveNumbers = 4,
    PositiveNumbersZ = 5,
    PositiveFloat = 6
  }

  export enum ComparisonResult {
    Faild = 0,
    Equal = 1,
    GreaterThan = 2,
    LessThan = 3,
  }

  export enum Lang {
    Ar = 1,
    En = 2
  }




}
