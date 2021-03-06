import { DataStore } from './services/dataStrore.service';
import { Router } from '@angular/router';
import { CoreEnums } from './core.enums';
import { environment } from 'src/environments/environment';
import { CoreSubjects } from './core.subjects';
import { User } from '../shared/Classes/User';
import { Pager } from '../shared/classes/Pager';
import { CoreHelper } from './services/core.helper';
import { AppEnums } from '../app.enums';
declare var $: any;
declare var jQuery: any;
declare var fx: any;


export abstract class BaseComponent {


  /*****************************
   *    Properties
   ****************************/
  public Now: Date = new Date();

  public Math: any = Math;

  public get resources(): any {
    return DataStore.resources;
  }

  public get DataStore(): any {
    return DataStore;
  }

  public get appRouter(): Router {
    return DataStore.router;
  }

  get CoreEnums(): any {
    return CoreEnums;
  }

  get AppEnums(): any {
    return AppEnums;
  }

  get CurrentUrl(): string {
    return environment.WebUrl + this.appRouter.url;
  }


  get CurrentRoute(): string {
    return this.appRouter.url;
  }

  get Language(): CoreEnums.Lang {
    if (environment.Lang === 'ar') {
      return CoreEnums.Lang.Ar;
    } else {
      return CoreEnums.Lang.En;
    }
  }

  get ActiveUser(): User {
    return <User>DataStore.get('ActiveUser');
  }

  get environment() {
    return environment;
  }

  get Currency() {
    return DataStore.get('Currency');
  }

  get CurrencyName() {
    return DataStore.get('CurrencyName');
  }

  /*****************************
   *    Constructor
   ****************************/
  constructor() {
  }



  /*****************************
   *    Methods
   ****************************/

  public navigate(route: string, criteria: any = null, newtab: boolean = false): void {

    //let queryParams: any = {};
    //if (criteria) {
    //  queryParams = JSON.stringify(criteria);
    //}
    if (newtab) {
      window.open(route);
    } else {
      if (criteria && Object.keys(criteria).length > 0)
        this.appRouter.navigate([route], { queryParams: criteria });
      else
        this.appRouter.navigate([route]);
    }
  }

  public localizeData(arColumn: string, enColumn: string, allowEmpty: boolean = false) {
    // console.log(environment.Lang)
    if (arColumn == null && enColumn == null) {
      return '';
    }
    if (arColumn == null && enColumn != null) {
      return enColumn;
    }
    if (enColumn == null && arColumn != null) {
      return arColumn;
    }
    if (typeof arColumn === 'undefined') {
      arColumn = '';
    }
    if (typeof enColumn === 'undefined') {
      enColumn = '';
    }

    // console.log(environment.Lang);

    if (environment.Lang === 'ar') {
      return ((!allowEmpty && (!arColumn || arColumn.replace(/\s/g, '').length === 0)) ? enColumn : arColumn);
    } else {
      return ((!allowEmpty && (!enColumn || enColumn.toString().replace(/\s/g, '').length === 0)) ? arColumn : enColumn);
    }
  }

  public clone(src: any): any {
    if (src instanceof Array) {
      return jQuery.extend(true, [], src);
    }
    return jQuery.extend(true, {}, src);
  }


  public formatDate(date: any, formatter: string) {

    return CoreHelper.formatDateForUI(new Date(date), formatter)

  }

  public formatMony(mony: any, withSymbol: boolean = true) {

    if (!mony || !fx || !this.Currency)
      return '';

    let val = (fx.convert(mony)).toFixed(2);
    let symbole = this.localizeData(this.Currency.symbol_native, this.Currency.symbol)

    if (withSymbol)
      return val + ' ' + symbole;
    else
      return val;
  }

  public getMonySymbol() {
    if (!this.Currency)
      return '';
    return this.localizeData(this.Currency.symbol_native, this.Currency.symbol)

  }

  public IsToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  public nextWindow(items: any, pager: Pager): any[] {
    let start = pager.PageIndex == 1 ? 0 : ((pager.PageIndex - 1) * pager.PageSize);
    return items.slice(start, start + pager.PageSize);
  }

  public convertToDate(val: string): Date {
    if (!val)
      return null;

    let parts = val.split('/');

    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[1]));
  }

  public async ConvertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
