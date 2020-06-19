import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { AppRoutingModule } from './app.routes';
import { CoreService } from './core/services/core.service';
import { CoreModule } from './core/core.module';

import { CoreHelper } from './core/services/core.helper';
import { SocialMedialService } from './services/socialMedia.Service';
import { AppLoader } from './components/loader/apploader';
import { App } from './components/app';
import { Landing } from './components/landing/landing';
import { AppHeader } from './components/header/appheader';
import { AppFooter } from './components/footer/appfooter';
import { AppNotificationDialog } from './components/notifications/appnotificationdialog';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { UsersService } from './modules/users/users.service';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { DataStore } from './core/services/dataStrore.service';
import { CoreEnums } from './core/core.enums';
import { ContactUs } from './components/contactus/contactus';
import { DotSpinner } from './shared/components/dotspinner';

@NgModule({
  declarations: [
    App,
    AppLoader,
    Landing,
    AppHeader,
    AppFooter,
    AppNotificationDialog,
    ContactUs
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    PopoverModule.forRoot(),
  ],
  providers: [
    SocialMedialService,
    { provide: APP_INITIALIZER, useFactory: LoadSettings, deps: [CoreService], multi: true },
    { provide: APP_INITIALIZER, useFactory: LoadUser, deps: [HttpClient], multi: true },
    { provide: LOCALE_ID, useFactory: () => CoreHelper.getCurrentLocale() },


  ],
  bootstrap: [App],
  exports: [DotSpinner]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeAr, 'ar');
  }
}

export function LoadSettings(CoreSVC: CoreService) {

  let styles = ['assets/app-styles/app-styles.{{lang}}.css', 'assets/styles/main.css', 'assets/styles/main.{{lang}}.css'];
  let scripts = ['assets/resources/resources.{{lang}}.js', 'https://apis.google.com/js/client:platform.js?onload=renderButton'];
  return () => CoreSVC.LoadAppSetting(styles, scripts, 'assets/images/logo.png')
}

export function LoadUser(http: HttpClient) {

  //var token = DataStore.get('token');
  //if (token) {
  //  var options = {
  //    headers: new HttpHeaders().set('accept', 'application/json')
  //      .set('Content-Type', 'application/json')
  //      .set('Access-Control-Allow-Origin', '*')
  //      .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
  //      .set('Authorization', 'Bearer ' + token)
  //  }

  //  return () => {
  //    http.get(window['_Config'].MainEndPoint + 'Api/User/Details', options).toPromise().then((res: any) => {
  //      DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
  //    });
  //  }
  //}
  //else
    return () => null;


}

