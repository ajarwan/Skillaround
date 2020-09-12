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
import { App } from './components/app';
import { Landing } from './components/landing/landing';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { UsersService } from './modules/users/users.service';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { DataStore } from './core/services/dataStrore.service';
import { CoreEnums } from './core/core.enums';
import { DotSpinner } from './shared/components/dotspinner';
import { SharedModule } from './shared/shared.mod';
import { ContactUs } from './shared/components/contactus';
import { Test } from './components/test';
import { environment } from 'src/environments/environment';
import { getParamByISO } from 'iso-country-currency';


declare var fx: any;
declare var _Currency: any;


@NgModule({
  declarations: [
    App,
    //AppLoader,
    Landing,
    //AppHeader,
    //AppFooter,
    //AppNotificationDialog,
    ContactUs,
    Test
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    PopoverModule.forRoot(),
  ],
  providers: [
    SocialMedialService,
    { provide: APP_INITIALIZER, useFactory: LoadSettings, deps: [CoreService], multi: true },
    { provide: APP_INITIALIZER, useFactory: LoadUser, deps: [HttpClient], multi: true },
    { provide: APP_INITIALIZER, useFactory: LoadCurrencies, deps: [HttpClient], multi: true },
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

  if (location.protocol != 'https:' && environment.production) {
    location.replace(window.location.href.replace("http:", "https:"));
    return;
  }
  let styles = ['assets/app-styles/app-styles.{{lang}}.css?v=1', 'assets/styles/main.css', 'assets/styles/main.{{lang}}.css?v=1'];
  let scripts = ['assets/resources/resources.{{lang}}.js', 'assets/currency/currency.js',
    'https://apis.google.com/js/client:platform.js?onload=renderButton'];
  return () => CoreSVC.LoadAppSetting(styles, scripts, 'assets/images/logo.png')
}

export function LoadUser(http: HttpClient) {

  var token = DataStore.get('token');
  if (token) {
    var options = {
      headers: new HttpHeaders().set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
        .set('Authorization', 'Bearer ' + token)
    }

    return () => {
      http.get(window['_Config'].MainEndPoint + 'Api/User/Details?include=WorkingDays', options).toPromise().then((res: any) => {
        DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
      });
    }
  }
  else
    return () => null;


}


export function LoadCurrencies(http: HttpClient) {
  var options = {
    headers: new HttpHeaders()
  }
  return () => {
    http.get('https://openexchangerates.org/api/latest.json?app_id=1ad3d9b9af184ef9a3806c0944f28a57', options).toPromise().then((res: any) => {
      if (typeof fx !== "undefined" && fx.rates) {
        fx.rates = res.rates;
        fx.base = res.base;
      } else {
        // If not, apply to fxSetup global:
        var fxSetup = {
          rates: res.rates,
          base: res.base
        }
      }
      fx.base = 'USD';

      var options2 = {
        headers: new HttpHeaders().set('accept', 'application/json')
          .set('Content-Type', 'application/json')
      }

      //dbip.getVisitorInfo().then(info => {
      //  console.log(info);
      //});
      //http.get(window['_Config'].MainEndPoint + 'Api/General/Location', options2).toPromise().then((innerRes: any) => {
      //  //debugger
      //  DataStore.addUpdate('CurrentCountryCode', innerRes.countryCode);
      //  let currencyName = getParamByISO(innerRes.countryCode, 'currency');
      //  DataStore.addUpdate('Currency', _Currency[currencyName]);
      //  DataStore.addUpdate('CurrencyName', currencyName);
      //  fx.settings = { from: "USD", to: currencyName };
      //}, (err: any) => {
      //  fx.settings = { from: "USD", to: "AED" };
      //});
      http.get('https://get.geojs.io/v1/ip/geo.js', { responseType: 'text' }).subscribe((innerRes: any) => {

        var code = innerRes.match(/"country_code":"([^"]+)"/)[1]
        DataStore.addUpdate('CurrentCountryCode', code);
        let currencyName = getParamByISO(code, 'currency');
        DataStore.addUpdate('Currency', _Currency[currencyName]);
        DataStore.addUpdate('CurrencyName', currencyName);
        fx.settings = { from: "USD", to: currencyName };

        //let currencyData = getAllInfoByISO('BE');
        //console.log(currencyData);
      }, (err: any) => {
        console.log('== API Error ==')
        console.log(err)
        fx.settings = { from: "USD", to: "AED" };
      });

    });
  }

}

