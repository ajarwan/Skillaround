import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, Route, NavigationStart, NavigationEnd } from '@angular/router';
import { CoreService } from '../core/services/core.service';
import { BaseComponent } from '../core/core.base';
import { DataStore } from '../core/services/dataStrore.service';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/service/shared.service';
import { User } from '../shared/Classes/User';
import { HttpInterceptor } from '../core/services/http.interceptor';
import { CoreSubjects } from '../core/core.subjects';
import { filter } from 'rxjs/operators';
import { CoreEnums } from '../core/core.enums';
import { CoreHelper } from '../core/services/core.helper';
import { SharedSubjects } from '../shared/service/shared.subjects';
import { AppEnums } from '../app.enums';
import { SocialMedialService } from '../services/socialMedia.Service';
 
 import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale, arLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgSelectConfig } from '@ng-select/ng-select';
import { AppLoader } from '../shared/components/apploader';
import { AppHeader } from '../shared/components/appheader';
import { AppFooter } from '../shared/components/appfooter';
import { AppNotificationDialog } from '../shared/components/appnotificationdialog';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html'
})
export class App extends BaseComponent implements OnInit {

  @ViewChild('appLoader', null) private appLoader: AppLoader;
  @ViewChild('appHeader', null) private appHeader: AppHeader;
  @ViewChild('appFooter', null) private appFooter: AppFooter;
  @ViewChild('appNotificationDialog', null) private appNotificationDialog: AppNotificationDialog;



  public lastUrl: NavigationEnd;
  /*****************************
 *    Constructor
 ****************************/
  constructor(private router: Router, private coreSVC: CoreService, private sharedSVC: SharedService,
    public http: HttpInterceptor,
    public cd: ChangeDetectorRef,
    public ngZone: NgZone,
    public smSVC: SocialMedialService,
    private localeService: BsLocaleService,
    private config: NgSelectConfig) {
    super();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.ngZone.run(() => {
        this.cd.detectChanges();
      })
    });

    this.coreSVC.initAp(this.router, window['_Resources']);
  }

  get IsUserModule() {
    return DataStore.get('CurrentModule') == AppEnums.Modules.Users
  }

  get IsSuppliersModule() {
    return DataStore.get('CurrentModule') == AppEnums.Modules.Supplier
  }

  get CurrentModule() {
    return DataStore.get('CurrentModule')
  }

  /*****************************
   *    Implementations
   ****************************/
  ngOnInit(): void {

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Users);


    this.appLoader.AddCall();


    console.log('Init App Component');

   

    this.registerEndPoints();


    this.HandleCoreSubjects();
    this.HandleSharedSubjects();

    this.smSVC.gInitialize();

    this.appLoader.RemoveCall();
    this.initThirdPartyResources();



  }

  registerEndPoints() {
    DataStore.endPoints = [
      new EndPointConfiguration(environment.MainEndPoint, AppEnums.EndPoints.Main, {
        headers: new HttpHeaders().set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('Access-Control-Allow-Origin', '*')
          .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
      })
    ];

  }


  public HandleCoreSubjects() {
    //App Loader
    CoreSubjects.loaderSubject.subscribe(res => {
      //console.log(res);
      if (res.res) {
        this.appLoader.AddCall();
      }
      else {
        this.appLoader.RemoveCall();
      }
    })

    CoreSubjects.onNavigation.subscribe((route: NavigationEnd) => {
      console.log()
    })
  }

  public HandleSharedSubjects() {

    //App Confirmation
    SharedSubjects.NotificationDialogSubject.subscribe((res: any) => {
      if (res) {
        if (res.type == AppEnums.DialogType.Notification) {
          //this.appNotificationDialog.Show(res.message);

        }
        else {
          this.appNotificationDialog.Show(res.message, res.type, res.onConfirm, res.onCancel, res.confirmButtonText, res.cancelButtonText, res.error)
        }
      }

    })
  }



  public initThirdPartyResources() {
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);
    this.localeService.use(environment.Lang);

    let dbConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-blue',
      isAnimated: true,
      adaptivePosition: true
    };

    let dbConfigRange = {
      dateInputFormat: 'MMM DD',
      rangeInputFormat: 'MMM DD',
      containerClass: 'theme-blue',
      isAnimated: true,
      adaptivePosition: true
    };

    DataStore.addUpdate('dbConfig', dbConfig);
    DataStore.addUpdate('dbConfigRange', dbConfigRange);

    this.config.notFoundText = this.resources.NoDataFound;
    this.config.appendTo = 'body';









    Date.prototype.toString = function () {
      return CoreHelper.formatDateForUI(this, 'MM/dd/yyyy');
    }

    Date.prototype.toJSON = function () {
      return CoreHelper.formatDateForUI(this, 'MM/dd/yyyy');
    }

    //setTimeout(() => {
    //  $.fancybox.defaults.i18n.ar = {
    //    CLOSE: 'إغلاق',
    //    NEXT: 'التالي',
    //    PREV: 'السابق'
    //  };

    //  $.fancybox.defaults.lang = environment.Lang;

    //}, 50);
  }

}
