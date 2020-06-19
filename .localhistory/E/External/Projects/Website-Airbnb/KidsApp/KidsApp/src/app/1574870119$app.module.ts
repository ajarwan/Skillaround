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

@NgModule({
  declarations: [
    App,
    AppLoader,
    Landing,
    AppHeader
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
  ],
  providers: [
    SocialMedialService,
    { provide: APP_INITIALIZER, useFactory: LoadSettings, deps: [CoreService], multi: true },
    { provide: LOCALE_ID, useFactory: () => CoreHelper.getCurrentLocale() },


  ],
  bootstrap: [App]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeAr, 'ar');
  }
}

export function LoadSettings(CoreSVC: CoreService) {

  let styles = ['assets/styles/main.{{lang}}.css', 'assets/app-styles/app-styles.{{lang}}.css'];
  let scripts = ['assets/resources/resources.{{lang}}.js', 'https://apis.google.com/js/client:platform.js?onload=renderButton'];
  return () => CoreSVC.LoadAppSetting(styles, scripts, 'assets/images/favicon.ico').then(() => {

  });
}

