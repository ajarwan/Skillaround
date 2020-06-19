import { environment } from 'src/environments/environment';

export abstract class Localization {

  public static get January() {
    return environment.Lang == 'ar' ? 'يناير' :'January';
  }

  public static get February() {
    return environment.Lang == 'ar' ? 'فبراير' : 'February';
  }

  public static get March () {
    return environment.Lang == 'ar' ? 'مارس' : 'March';
  }

  public static get April() {
    return environment.Lang == 'ar' ? 'أبريل' : 'April';
  }

  public static get May () {
    return environment.Lang == 'ar' ? 'مايو' : 'May';
  }

  public static get June () {
    return environment.Lang == 'ar' ? 'يونيو' : 'June';
  }

  public static get July () {
    return environment.Lang == 'ar' ? 'يوليو' : 'July';
  }

  public static get August () {
    return environment.Lang == 'ar' ? 'أغسطس' : 'August';
  }

  public static get September () {
    return environment.Lang == 'ar' ? 'سبتمبر' : 'September ';
  }

  public static get October() {
    return environment.Lang == 'ar' ? 'أكتوبر' : 'October';
  }

  public static get November () {
    return environment.Lang == 'ar' ? 'نوفمبر' : 'November ';
  }

  public static get December() {
    return environment.Lang == 'ar' ? 'ديسمبر' : 'December';
  }


  public static get Jan() {
    return environment.Lang == 'ar' ? 'يناير' : 'Jan';
  }

  public static get Feb() {
    return environment.Lang == 'ar' ? 'فبراير' : 'Feb';
  }

  public static get Mar() {
    return environment.Lang == 'ar' ? 'مارس' : 'Mar';
  }

  public static get Apr() {
    return environment.Lang == 'ar' ? 'أبريل' : 'Apr';
  }

  public static get Ma() {
    return environment.Lang == 'ar' ? 'مايو' : 'May';
  }

  public static get Jun() {
    return environment.Lang == 'ar' ? 'يونيو' : 'Jun';
  }

  public static get Jul() {
    return environment.Lang == 'ar' ? 'يوليو' : 'Jul';
  }

  public static get Aug() {
    return environment.Lang == 'ar' ? 'أغسطس' : 'Aug';
  }

  public static get Sep() {
    return environment.Lang == 'ar' ? 'سبتمبر' : 'Sep ';
  }

  public static get Oct() {
    return environment.Lang == 'ar' ? 'أكتوبر' : 'Oct';
  }

  public static get Nov() {
    return environment.Lang == 'ar' ? 'نوفمبر' : 'Nov ';
  }

  public static get Dec() {
    return environment.Lang == 'ar' ? 'ديسمبر' : 'Dec';
  }

  public static get Saturday() {
    return environment.Lang == 'ar' ? 'السبت' : 'Saturday';
  }

  public static get Sunday() {
    return environment.Lang == 'ar' ? 'الأحد' : 'Sunday';
  }

  public static get Monday() {
    return environment.Lang == 'ar' ? 'الأثنين' : 'Monday';
  }

  public static get Tuesday() {
    return environment.Lang == 'ar' ? 'الثلاثاء' : 'Tuesday';
  }

  public static get Wednesday() {
    return environment.Lang == 'ar' ? 'الأربعاء' : 'Wednesday';
  }

  public static get Thursday() {
    return environment.Lang == 'ar' ? 'الخميس' : 'Thursday';
  }

  public static get Friday() {
    return environment.Lang == 'ar' ? 'الجمعة' : 'Friday';
  }

  public static get Sa() {
    return environment.Lang == 'ar' ? 'س' : 'Sa';
  }

  public static get Su() {
    return environment.Lang == 'ar' ? 'ح' : 'Su';
  }

  public static get Mo() {
    return environment.Lang == 'ar' ? 'ن' : 'Mo';
  }

  public static get Tu() {
    return environment.Lang == 'ar' ? 'ث' : 'Tu';
  }

  public static get We() {
    return environment.Lang == 'ar' ? 'ر' : 'We';
  }

  public static get Th() {
    return environment.Lang == 'ar' ? 'خ' : 'Th';
  }

  public static get Fr() {
    return environment.Lang == 'ar' ? 'ج' : 'Fr';
  }
}
