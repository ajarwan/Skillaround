import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, Route, NavigationStart, NavigationEnd } from '@angular/router';
import { CoreService } from '../core/services/core.service';
import { BaseComponent } from '../core/core.base';
import { DataStore } from '../core/services/dataStrore.service';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/service/shared.service';
import { User, BasicSOABody } from '../shared/Classes/User';
import { HttpInterceptor } from '../core/services/http.interceptor';
import { AppLoader } from './loader/app-loader.component';
import { CoreSubjects } from '../core/core.subjects';
import { filter } from 'rxjs/operators';
import { CoreEnums } from '../core/core.enums';
import { CoreHelper } from '../core/services/core.helper';
import { SharedSubjects } from '../shared/service/shared.subjects';
import { AppEnums } from '../app.enums';
import { SocialMedialService } from '../services/socialMedia.Service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent implements OnInit {

  @ViewChild('appLoader', null) private appLoader: AppLoader;

  public t: any;

  public isLoaderShown = true;

  public datafromcoreservice = '';

  public routesData: any[] = [];

  public lastUrl: NavigationEnd;
  /*****************************
 *    Constructor
 ****************************/
  constructor(private router: Router, private coreSVC: CoreService, private sharedSVC: SharedService,
    public http: HttpInterceptor,
    public cd: ChangeDetectorRef,
    public ngZone: NgZone,
    public smSVC: SocialMedialService) {
    super();

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.ngZone.run(() => {
        this.cd.detectChanges();
      })
    })
  }


  /*****************************
   *    Implementations
   ****************************/
  ngOnInit(): void {

    console.log('Init App Component');
    this.registerEndPoints();
    this.coreSVC.initAp(this.router, window['_Resources']);

    this.HandleCoreSubjects();
    //this.initThirdPartyResources();

    //this.smSVC.InitGoogleApis();
    this.smSVC.gSignOut();
    
  }

  registerEndPoints() {
    DataStore.endPoints = [
      new EndPointConfiguration(environment.MainEndPoint, AppEnums.EndPoints.Main, {
        headers: new HttpHeaders().set('accept', 'application/json')
          .set('Content-Type', 'application/json')
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

    })
  }




  //public initThirdPartyResources() {
  //  setTimeout(() => {
  //    $.fancybox.defaults.i18n.ar = {
  //      CLOSE: 'إغلاق',
  //      NEXT: 'التالي',
  //      PREV: 'السابق'
  //    };

  //    $.fancybox.defaults.lang = environment.Lang;

  //  }, 50);
  //}

}
