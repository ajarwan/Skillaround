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

export abstract class BaseComponent {


  /*****************************
   *    Properties
   ****************************/

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

    return CoreHelper.formatDateForUI(new date(date), formatter)

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
}
