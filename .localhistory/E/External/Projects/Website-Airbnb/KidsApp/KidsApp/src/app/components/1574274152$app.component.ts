import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, Route, NavigationStart, NavigationEnd } from '@angular/router';
import { CoreService } from '../core/services/core.service';
import { BaseComponent } from '../core/core.base';
import { DataStore } from '../core/services/dataStrore.service';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { environment } from 'src/environments/environment';
import { EndPoints } from '../app.enums';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/service/shared.service';
import { User, BasicSOABody } from '../shared/Classes/User';
import { HttpInterceptor } from '../core/services/http.interceptor';
import { AppLoader } from './loader/app-loader.component';
import { CoreSubjects } from '../core/core.subjects';
import { filter } from 'rxjs/operators';
import { CoreEnums } from '../core/core.enums';
import { Observer, Subscriber } from 'rxjs';
import { SOAService } from '../services/soa.services';
import { CoreHelper } from '../core/services/core.helper';
import { SharedSubjects } from '../shared/service/shared.subjects';
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
    public http: HttpInterceptor, public cd: ChangeDetectorRef, public ngZone: NgZone,
    private soaSVC: SOAService) {
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
    this.loadCurrentUser();
    this.initThirdPartyResources();

    this.t = setInterval(() => {
      if (DataStore.get('NavigationMenuItems')) {
        clearInterval(this.t);
        if (this.lastUrl) {
          CoreSubjects.onNavigation.next(this.lastUrl);
        }
      }
    }, 250)

  }


  registerEndPoints() {
    DataStore.endPoints = [
      new EndPointConfiguration(environment.SPEndPoint, EndPoints.SP, {
        headers: new HttpHeaders().set('accept', 'application/json;odata=verbose')
          .set('Content-Type', 'application/json;odata=verbose')
          .set('IF-MATCH', '*')
          .set('Allow-Origin-With-Credentials', 'true')
          .set('Access-Control-Allow-Credentials', 'true')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-RequestDigest', $("#__REQUESTDIGEST").length > 0 ? $("#__REQUESTDIGEST").val().toString() : "0xC1F5ADA9025601468C4887DF4AFE51E33D057CC707EDACDCFDF43EA4B0AC801124278043185124C28D04B6F48AC8C1AA20EFF0BB02A1E76E02AE7565BB97FBDE,12 Nov 2019 07:30:10 -0000")
      }),
      new EndPointConfiguration(environment.SOAEndPoint, EndPoints.SOA, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      }),
      new EndPointConfiguration(environment.CustomEndPoint, EndPoints.CUSTOM, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      })
    ];


    setInterval(() => {
      this.sharedSVC.refreshToken().subscribe((res: any) => {
        console.log(res);
        DataStore.endPoints.filter((x: EndPointConfiguration) => x.code == EndPoints.SP)[0].options.headers =
          new HttpHeaders().set('accept', 'application/json;odata=verbose')
            .set('Content-Type', 'application/json;odata=verbose')
            .set('Allow-Origin-With-Credentials', 'true')
            .set('Access-Control-Allow-Credentials', 'true')
            .set('Access-Control-Allow-Origin', '*')
            .set('IF-MATCH', '*')
            .set('X-RequestDigest', res.d.GetContextWebInformation.FormDigestValue)


      }, () => {
        DataStore.addUpdate('RequestDigest', "0x269331D9B434874519BC58EBA6EE79B39FC246BF4394F45A47A5F42D303E9584D84A0E8B96299C0B49A5BDDB729EA71E821629D5BA02192C30A66BDE4EA427B2,10 Oct 2019 09:35:50 -0000");
      });
    }, environment.TokenRefreshTimeOut)

  }

  loadCurrentUser() {
    this.sharedSVC.loadCurrentUserData().subscribe((res: any) => {

      res = res.d;
      let user: User = new User();
      user.Id = res.Id;
      user.IsAdmin = res.IsSiteAdmin;
      user.Name = res.Title;
      user.UserName = environment.production ? res.LoginName.split('cpc')[1].replace('\\', '') : 'es246';
      user.Email = res.Email;

      DataStore.addUpdate('ActiveUser', user);

      this.sharedSVC.GetEmployeeNamePhotoInfo(user.UserName, false).subscribe((innerRes: any) => {
        user.FullNameAr = innerRes.fullNameAr;
        user.FullNameEn = innerRes.fullNameEn;
        user.ImageUrl = innerRes.imageUrl;

      });

      //Check User System Guid
      this.sharedSVC.loadUserSystems(user.UserName).subscribe((innerRes: any) => {

        if (innerRes && innerRes.d.results) {
          innerRes = innerRes.d.results[0];
          user.UserGUID = innerRes.UserGUID;
          user.TimeAttendance = innerRes.TimeAttendance;
          user.AnnualLeaves = innerRes.AnnualLeaves;
          user.MissionRequest = innerRes.MissionRequest;
          user.ShortVisit = innerRes.ShortVisit;
          this.getSOAToken();
        }
        else {
          user.UserGUID = CoreHelper.NewGuid();
          user.TimeAttendance = false;
          user.AnnualLeaves = false;
          user.MissionRequest = false;
          user.ShortVisit = false;
          this.sharedSVC.addUserSystems(user).subscribe((innerRes: any) => {

          });
        }

        SharedSubjects.onUserGuidsLoad.next();
      });

    }, (err: any) => {
      console.log(err);
    });
  }

  public getSOAToken() {

    this.soaSVC.getSOAToken().subscribe((res: any) => {
      console.log(res);
      if (res.output && res.output.token) {
        this.ActiveUser.SOAToken = res.output.token
        this.ActiveUser.initSOABody();
      }
    })
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

      this.lastUrl = route;
      var routes = DataStore.get('NavigationMenuItems');

      if (!routes)
        return;


      routes.forEach((node) => {

        this.routesData.push({ Url: node.Url, Title: this.localizeData(node.NameAr, node.NameEn) });
        if (node.Child && node.Child.length > 0) {
          this.fillTree(node.Child)
        }
      });


      var title = '';
      if (route.urlAfterRedirects) {
        if (this.routesData.filter((x: any) => '/' + x.Url == route.urlAfterRedirects)[0])
          title = this.routesData.filter((x: any) => '/' + x.Url == route.urlAfterRedirects)[0].Title;
        else
          title = this.getTitleFromMiscPages()
      }

      else {
        if (this.routesData.filter((x: any) => '/' + x.Url == route.url)[0])
          title = this.routesData.filter((x: any) => '/' + x.Url == route.url)[0].Title;
        else
          title = this.getTitleFromMiscPages()
      }

      document.title = this.resources.zajel + ' - ' + title;

      let navData: any = {
        "url": location.href,
        "pageTitle": document.title,
        "pageName": title,
        "siteLanguage": environment.Lang == 'ar' ? 'Arabic' : 'English'
      }

      this.sharedSVC.logUserNavigation(navData).subscribe((res: any) => {

      }, (err: any) => {
        console.error('Erro in Add Statistics Data');
        console.log(err)
      });

    })
  }

  public fillTree(tree: any[]) {

    if (!tree)
      return;

    tree.forEach((node) => {

      this.routesData.push({ Url: node.Url, Title: this.localizeData(node.NameAr, node.NameEn) });
      if (node.Child && node.Child.length > 0) {
        this.fillTree(node.Child)
      }
    });

  }

  public getTitleFromMiscPages(): string {
    let routes = DataStore.get('NavigationMenuItems');
    if (this.CurrentUrl.indexOf('media/albums') > -1) {
      let r = routes.filter((x: any) => x.Id == 5)[0].Child.filter((x: any) => x.Id == 1)[0];

      return this.localizeData(r.NameAr, r.NameEn);
    }

    return "";
  }

  public initThirdPartyResources() {
    setTimeout(() => {
      $.fancybox.defaults.i18n.ar = {
        CLOSE: 'إغلاق',
        NEXT: 'التالي',
        PREV: 'السابق'
      };

      $.fancybox.defaults.lang = environment.Lang;

    }, 50);
  }

}
