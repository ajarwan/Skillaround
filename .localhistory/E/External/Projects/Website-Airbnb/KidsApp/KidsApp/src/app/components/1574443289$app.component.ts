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
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
declare var $: any;
declare var gapi: any;

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
    public http: HttpInterceptor, public cd: ChangeDetectorRef, public ngZone: NgZone) {
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

    gapi.signin2.render('gSignIn', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': (res) => {
        this.onLoginSuccess(res);
      },
      'onfailure': () => {
        console.log('faild')
      }
    });

    this.gMailSignOut();
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


  public onLoginSuccess(res) {

    console.log('on Gmail LoginSuccess');

    var profile = res.getBasicProfile();
    console.log('-------profile------------');

    console.log(profile);

    gapi.client.load('oauth2', 'v2', function () {
      var request = gapi.client.oauth2.userinfo.get({
        'userId': 'me'
      });
      request.execute(function (resp) {
        console.log('exeec')
        console.log(resp)
      });
    });
  }

  public gMailSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      //document.getElementsByClassName("userContent")[0].innerHTML = '';
      //document.getElementsByClassName("userContent")[0].style.display = "none";
      //document.getElementById("gSignIn").style.display = "block";
    });

    auth2.disconnect();
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
