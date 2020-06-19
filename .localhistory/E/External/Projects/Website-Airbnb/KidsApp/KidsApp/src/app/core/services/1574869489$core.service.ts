import { Injectable } from '@angular/core';
import { DataStore } from './dataStrore.service';
import { NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd, Router, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { CoreEnums } from '../core.enums';
import { CoreSubjects } from '../core.subjects';


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  /*****************************
   *    Properties
   ****************************/
  private isAppInitialized = false;
  /*****************************
  *    Constructor
  ****************************/
  constructor() {
  }


  /*****************************
   *    Methods
   ****************************/
  public LoadAppSetting(styles: string[], scripts: string[], icon: string): Promise<any> {

    console.log('--------------Load App Settings--------------');

    // Load Styles [based on language]
    // Load Resources [based on language]


    // TODO

    const storedLang = DataStore.get('Lang');
    if (!storedLang) {
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);
    }

    environment.Lang = DataStore.get('Lang');

    const pro = new Promise((resolve) => {

      //debugger;
      // Load Styles
      for (let i = 0; i < styles.length; i++) {
        styles[i] = styles[i].replace('{{lang}}', environment.Lang);
      }
      for (let i = 0; i < scripts.length; i++) {
        scripts[i] = scripts[i].replace('{{lang}}', environment.Lang);
      }


      //const styles = [];

      // if (environment.Lang === 'ar') {
      //   styles.push({
      //     href: 'assets/styles/main.ar.css'
      //   });
      // }

      // styles.push({
      //   href: 'assets/app-styles/app-styles.' + environment.Lang + '.css'
      // });


      if (environment.Lang === 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        document.getElementsByTagName('html')[0].className = 'rtl';
      } else {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
        document.getElementsByTagName('html')[0].className = 'ltr';
      }

      styles.forEach((style: any) => {
        const StyleEl: HTMLStyleElement = document.createElement('link');
        StyleEl.type = 'text/css';
        StyleEl.media = 'all';
        StyleEl.setAttribute('rel', 'stylesheet');
        StyleEl.setAttribute('href', style);
        //document.head.appendChild(StyleEl);
      });

      console.log('Styles Added');

      //Add Image Icon
      const iconLink: HTMLStyleElement = document.createElement('link');
      iconLink.type = 'image/x-icon';
      iconLink.media = 'all';
      iconLink.setAttribute('rel', 'icon');
      iconLink.setAttribute('href', icon); //'assets/images/favicon.ico'
      document.head.appendChild(iconLink);

      // Load Resources
      for (let i = 0; i < scripts.length; i++) {
        const ResEl: HTMLScriptElement = document.createElement('script');
        document.body.appendChild(ResEl).src = scripts[i];
        ResEl.async = false;
        ResEl.onload = (e: any) => {

          if (i + 1 == scripts.length) {
            resolve(true);
            console.log('Scripts Loaded');
          }

        };
      }


      //scripts.forEach((script: any) => {
      //  const ResEl: HTMLScriptElement = document.createElement('script');
      //  document.body.appendChild(ResEl).src = script;
      //  ResEl.async = false;
      //  ResEl.onload = (e: any) => {

      //    resolve(true);
      //    console.log('Scripts Loaded');
      //  };
      //});
    });

    return pro;

  }


  public initAp(router: Router, resources: any): void {

    // Execute Initialization App Code
    if (this.isAppInitialized) {
      throw new Error('---------- App Is Already Initializaed And Can Not Be Initialized Again ! ----------');
    }

    DataStore.init(router, resources);

    this.watchRouter();

    this.isAppInitialized = true;

  }

  public refreshAge(): void {
    // Extend Session Time Out
  }


  public xmlToJson(xml): any {

    //debugger;

    if (!xml)
      return null;

    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      //if (xml.attributes.length > 0) {
      //  obj = {};
      //  for (var j = 0; j < xml.attributes.length; j++) {
      //    var attribute = xml.attributes.item(j);
      //    obj[attribute.nodeName] = attribute.nodeValue;
      //  }
      //}
    } else if (xml.nodeType == 3) {

      obj = xml.nodeValue;
    }
    else if (xml.nodeType == 4) {

      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;

        if (nodeName == '#cdata-section')
          nodeName = 'data'

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  };

  /*****************************
   *    private Helpers
   ****************************/
  private watchRouter() {

    // DataStore.router.onSameUrlNavigation = 'reload';
    // DataStore.router.routeReuseStrategy.shouldReuseRoute = () => false;

    DataStore.router.events.subscribe((val: any) => {
      //console.log(val);
      if (val instanceof NavigationStart) {
        // TODO
        // Code to check if the current user can activate the route
        if (val.url.indexOf('.aspx') > 0) {
          DataStore.addUpdate('ReturnURL', val.url);
          DataStore.router.navigate(['main']);
        }
        else
          CoreSubjects.loaderSubject.next({ res: true, value: val });

        //Scroll Top
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
      }
      if (val instanceof NavigationEnd) {
        CoreSubjects.loaderSubject.next({ res: false, value: val });
        CoreSubjects.onNavigation.next(val);

      }
      if (val instanceof RouteConfigLoadStart) {
        // Code to show spinner for lazy loaded modules
        console.log('Start Loading Lazy module')
      }
      if (val instanceof RouteConfigLoadEnd) {
        // Code to hide spinner for lazy loaded modules
      }
    });


    // Code to be executed on browser back button
    window.onpopstate = () => {

      $('.modal').hide();
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();

      // let routConfig: any = DataStore.router.config.map((route) => Object.assign({}, route));
      // DataStore.router.resetConfig(routConfig);
    };

  }



}
