import { environment } from 'src/environments/environment';
import { CoreEnums } from '../core.enums';
import { Localization } from './localization';

export abstract class CoreHelper {
  public static defaultLocaleId = 'en-US';

  public static implementedLocales = ['ar', CoreHelper.defaultLocaleId];

  public static getCurrentLocale(): string {
    return environment.Lang;
  }

  public static get Months(): any[] {
    return [
      Localization.January,
      Localization.February,
      Localization.March,
      Localization.April,
      Localization.May,
      Localization.June,
      Localization.July,
      Localization.August,
      Localization.September,
      Localization.October,
      Localization.November,
      Localization.December,
    ];
  }


  public static get MonthsShort(): any[] {
    return [
      Localization.Jan,
      Localization.Feb,
      Localization.Mar,
      Localization.Apr,
      Localization.Ma,
      Localization.Jun,
      Localization.Jul,
      Localization.Aug,
      Localization.Sep,
      Localization.Oct,
      Localization.Nov,
      Localization.Dec,
    ];
  }

  public static get Days(): any[] {
    return [
      Localization.Sunday,
      Localization.Monday,
      Localization.Tuesday,
      Localization.Wednesday,
      Localization.Thursday,
      Localization.Friday,
      Localization.Saturday
    ];
  }

  public static get DaysShort(): any[] {
    return [
      Localization.Su,
      Localization.Mo,
      Localization.Tu,
      Localization.We,
      Localization.Th,
      Localization.Fr,
      Localization.Sa
    ];
  }

  public static ZeroToNull(input) {
    if (input == 0)
      return null;

    return input;
  }

  public static NewGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public static GetFileExtension(fileName: string) {

    return fileName.substring(fileName.lastIndexOf('.') + 1).toString().trim().toLowerCase();;
  }

  public static ToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  public static NoOfDays(d1, d2) {


    // To calculate the time difference of two dates 
    var Difference_In_Time = d1.getTime() - d2.getTime();

    // To calculate the no. of days between two dates 
    return Difference_In_Time / (1000 * 3600 * 24);

  }

  public static CompareDates(startDate: Date, endDate: Date, withtime: boolean = false): boolean {
    if (!startDate || !endDate)
      return true;

    let tempSDate;
    let tempEDadet;


    tempSDate = new Date(Date.parse(startDate.toString()));


    tempEDadet = new Date(Date.parse(endDate.toString()));


    if (!withtime) {
      tempSDate.setHours(0, 0, 0, 0);
      tempEDadet.setHours(0, 0, 0, 0);
    }

    if (tempSDate.getTime() > tempEDadet.getTime())
      return false;

    return true;

  }

  public static CompareTimes(startTime: string, endTime: string): boolean {

    let StartDate = new Date();
    let StartTimeParts: any[] = startTime.split(":");
    StartDate.setHours(StartTimeParts[0], StartTimeParts[1]);

    let EndDate = new Date();
    let EndTimeParts: any[] = endTime.split(":");
    EndDate.setHours(EndTimeParts[0], EndTimeParts[1]);

    return CoreHelper.CompareDates(StartDate, EndDate, true);
  }

  public static CompareDatesResult(compare: string, compareTo: string, withtime: boolean = false): CoreEnums.ComparisonResult {
    if (!compare || !compareTo)
      return CoreEnums.ComparisonResult.Faild;

    let compareDate: Date = new Date(Date.parse(compare));
    let compareToDate: Date = new Date(Date.parse(compareTo));

    if (!withtime) {
      compareDate.setHours(0, 0, 0, 0);
      compareToDate.setHours(0, 0, 0, 0);
    }

    if (compareDate.getTime() == compareToDate.getTime())
      return CoreEnums.ComparisonResult.Equal;
    else if (compareDate.getTime() > compareToDate.getTime())
      return CoreEnums.ComparisonResult.GreaterThan;
    else
      return CoreEnums.ComparisonResult.LessThan;


  }

  public static lPad(input: string, length: number, char: string) {
    if (input.toString().length < length) {

      let diff = length - input.toString().length;
      let temp = '';
      for (let i = 0; i < diff; i++) {
        temp = temp + char;
      }

      return temp + input.toString();
    } else {
      return input;
    }
  }

  public static formatDateForUI(date: Date, format: string) {
    if (!date || !format)
      return null;

    let dateParts = CoreHelper.getDatePartitions(date);

    let indx = 0;
    let c = ''
    let token = ''
    let result = '';
    while (indx < format.length) {
      c = format.charAt(indx);
      token = '';
      while ((format.charAt(indx) == c) && (indx < format.length)) {
        token += format.charAt(indx++);
      }
      if (dateParts[token] != null) { result = result + dateParts[token]; }
      else { result = result + token; }
    }

    return result;
  }

  private static getDatePartitions(date: Date) {
    let parts = new Object();

    parts["yyyy"] = date.getFullYear();
    parts["yy"] = date.getFullYear().toString().substring(2, 4);
    parts["M"] = date.getMonth() + 1
    parts["MM"] = CoreHelper.lPad((date.getMonth() + 1).toString(), 2, '0');
    parts["MMM"] = CoreHelper.Months[date.getMonth()];
    parts["mmm"] = CoreHelper.MonthsShort[date.getMonth()];
    parts["d"] = date.getDate();
    parts["dd"] = CoreHelper.lPad(date.getDate().toString(), 2, '0');
    parts["DDD"] = CoreHelper.Days[date.getDay()];
    parts["ddd"] = CoreHelper.DaysShort[date.getDay()];

    parts["h"] = date.getHours();
    parts["hh"] = CoreHelper.lPad(date.getHours().toString(), 2, '0');
    parts["m"] = date.getMinutes();
    parts["mm"] = CoreHelper.lPad(date.getMinutes().toString(), 2, '0');
    parts["s"] = date.getSeconds();
    parts["ss"] = CoreHelper.lPad(date.getSeconds().toString(), 2, '0');
    //to implement time partions later
    return parts;

  }

  public static TruncateText(value: string) {

    let result = value || '';
    if (result.length < 15) {
      return result;
    }
    result = result.substring(0, 15) + "...";
    return result;

  }

  public static TimeToDate(time: any): Date {
    if (!time) {
      return null;
    }

    let d = new Date();

    d.setHours(time.hour);
    d.setMinutes(time.minute);
    d.setSeconds(time.second);

    return d;
  }

  public static StringToTime(time: any): any {
    if (!time) {
      return null;
    }

    const split = time.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split.length > 2 ? split[2] : 0, 10)
    };
  }
}
