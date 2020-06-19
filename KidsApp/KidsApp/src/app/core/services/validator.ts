import { CoreEnums } from '../core.enums';



export class Validator {
  /*****************************
  *      Properties
  *****************************/
  constructor() { }


  /*****************************
  *      Methods
  *****************************/
  public static StringIsNullOrEmpty(str: any): boolean {

    if (typeof str == 'number') {
      return false;
    } else {
      if (str && str.trim() != '')
        return false;
      else
        return true;
    }
  }

  public static RichTextboxIsNullOrEmpty(rt: any): boolean {
    if (!rt || (rt && rt.trim() == '')) return true;

    var content = rt
      .replace(/&nbsp;/ig, ' ')
      .replace(/<p>/ig, ' ')
      .replace(/<\/p>/gm, ' ')
      .replace(/<br \/>/gm, ' ')
      .replace(/<br>/ig, ' ').trim();

    if (content == '')
      return true;

    return false;

  }

  public static isValidInteger(int: any): boolean {
    if (int) {
      if (int === parseInt(int, 10))
        return true;
      else
        return false;
    }
    else
      return false;
  }

  public static isValidNumber(num: any): boolean {
    return !isNaN(num);
  }


  public static IsValidDate(date: any): boolean {
    if (date instanceof Date)
      return true;
    else if (!isNaN(Date.parse(date)))
      return true;
    else
      return false;
  }

  public static IsValidEmail(email: any): boolean {

    let emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailPattern.test(email))
      return false;
    return true;
  }

  public static IsValidPhone(phone: any): boolean {
    if (this.StringIsNullOrEmpty(phone))
      return false;
    let phoneLength = Object.keys(phone).length;

    if (phoneLength >= 10 && phoneLength <= 15)
      return true
    else
      return false

  }

  public static IsObjectNullOrEmpty(object: any): boolean {
    if (object == null) return true;
    for (let prop in object) {
      if (object.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  public static IsValidURL(url: any): boolean {

    let pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!pattern.test(url))
      return false;
    return true;
  }
}
