import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { AppRoutingModule } from './app.routes';
import { CoreService } from './core/services/core.service';
import { CoreModule } from './core/core.module';

import { AppComponent } from './components/app.component';
import { AppLoader } from './components/loader/app-loader.component';
import { CoreHelper } from './core/services/core.helper';
import { LandingComponent } from './components/landing.component';
import { SocialMedialService } from './services/socialMedia.Service';

@NgModule({
  declarations: [
    AppComponent,
    AppLoader,
    LandingComponent
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
    { provide: APP_INITIALIZER, useFactory: LoadUser, deps: [CoreService], multi: true },


  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeAr, 'ar');
  }
}

export function LoadSettings(CoreSVC: CoreService) {

  let styles = ['assets/styles/main.{{lang}}.css', 'assets/app-styles/app-styles.{{lang}}.css'];
  let scripts = ['assets/resources/resources.{{lang}}.js'];
  return () => CoreSVC.LoadAppSetting(styles, scripts, 'assets/images/favicon.ico').then(() => {

  });
}

export function LoadUser(CoreSVC: CoreService) {

  let styles = ['assets/styles/main.{{lang}}.css', 'assets/app-styles/app-styles.{{lang}}.css'];
  let scripts = ['assets/resources/resources.{{lang}}.js'];
  return () => CoreSVC.LoadAppSetting(styles, scripts, 'assets/images/favicon.ico').then(() => {

  });
}

