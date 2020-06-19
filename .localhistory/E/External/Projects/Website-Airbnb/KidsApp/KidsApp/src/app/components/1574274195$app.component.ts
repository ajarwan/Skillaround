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
    this.loadCurrentUser();
    this.initThirdPartyResources();



  }


  registerEndPoints() {
    DataStore.endPoints = [
      new EndPointConfiguration(environment.SPEndPoint, AppEnums.EndPoints.SP, {
        headers: new HttpHeaders().set('accept', 'application/json;odata=verbose')
          .set('Content-Type', 'application/json;odata=verbose')
          .set('IF-MATCH', '*')
          .set('Allow-Origin-With-Credentials', 'true')
          .set('Access-Control-Allow-Credentials', 'true')
          .set('Access-Control-Allow-Origin', '*')
          .set('X-RequestDigest', $("#__REQUESTDIGEST").length > 0 ? $("#__REQUESTDIGEST").val().toString() : "0xC1F5ADA9025601468C4887DF4AFE51E33D057CC707EDACDCFDF43EA4B0AC801124278043185124C28D04B6F48AC8C1AA20EFF0BB02A1E76E02AE7565BB97FBDE,12 Nov 2019 07:30:10 -0000")
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
