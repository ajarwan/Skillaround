import { Injectable } from '@angular/core';
import { Observable, Subscription, Observer } from 'rxjs';

import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { EndPoints } from 'src/app/app.enums';
import { UrlConfig, HttpInterceptor } from 'src/app/core/services/http.interceptor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { User } from '../Classes/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpInterceptor, private http2: HttpClient) { }

  get ActiveUser(): User {
    return (<User>DataStore.get('ActiveUser'));
  }



  private readonly ListsBase = '_api/web/lists/';

  private get spEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === EndPoints.SP)[0];
    }
    return null;
  }

  private get customEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === EndPoints.CUSTOM)[0];
    }
    return null;
  }


  /***********************
   *  Helper Methods
   ************************/


  /***********************
   * APIs Calls
   ***********************/

  public getMainMenuItems(showLoader: boolean = true): Observable<Response> {
    return this.http.get(
      new UrlConfig(`${this.ListsBase}getbytitle('NavigationMenu')/items?$select=Description`,
        this.spEndPoint),
      showLoader, false);
  }

  public getFooterQuickLinks(showLoader: boolean = true): Observable<Response> {
    return this.http.get(
      new UrlConfig(`${this.ListsBase}getbytitle('FooterQuickLinks')/items?$select=TitleAr,TitleEn,URL,IsNew`,
        this.spEndPoint),
      showLoader, false);
  }

  public getSocialMediaLinks(): Observable<Response> {
    return this.http.get(
      // tslint:disable-next-line:max-line-length
      new UrlConfig(`${this.ListsBase}getbytitle('FooterSocialMedia')/items?$select=TitleAr,TitleEn,URL&$filter=IsPublished eq '1'&$orderby=OrderId `,
        this.spEndPoint),
      null, false);
  }

  public loadCurrentUserData(): Observable<Response> {
    return this.http.get(
      new UrlConfig(`_api/web/CurrentUser`,
        this.spEndPoint),
      null, false);
  }

  public loadUserSystems(userAccount: string): Observable<Response> {
    return this.http.get(
      new UrlConfig(`${this.ListsBase}getbytitle('CPCUsersGUID')/items?$filter=UserAccount eq '${userAccount}'`, this.spEndPoint),
      null, false);
  }


  public addUserSystems(user: User): Observable<Response> {

    let userguid: any = {
      '__metadata': {
        'type': 'SP.Data.CPCUsersGUIDListItem' // it defines the ListEnitityTypeName  
      },
      UserAccount: `${user.UserName}`,
      AnnualLeaves: `false`,
      MissionRequest: `false`,
      TimeAttendance: `false`,
      ShortVisit: `false`,
      UserGUID: user.UserGUID
    };

    return this.http.post(
      new UrlConfig(`${this.ListsBase}getbytitle('CPCUsersGUID')/items`,
        this.spEndPoint), JSON.stringify(userguid),
      false);
  }


  public logUserNavigation(navigationData: any): Observable<Response> {
    return this.http.post(
      new UrlConfig(`_vti_bin/AlZajel_Services/AlZajelWCF.svc/Statistic`,
        this.spEndPoint), navigationData, false);
  }

  refreshToken(): Observable<Response> {
    return this.http.post(
      new UrlConfig(`_api/contextinfo`,
        this.spEndPoint), null, false);
  }

  public getCPCContactInfo(showLoader: boolean = true): Observable<Response> {
    return this.http.get(
      new UrlConfig(`${this.ListsBase}getbytitle('AlzajelContents')/items?$select=Id,TitleAr,TitleEn,NameAr,NameEn,DescriptionAr,DescriptionEn,OfficeTitleAr,OfficeTitleEn,SummaryAr,SummaryEn,ImageName,Title&$filter=PageName%20eq%20%27SpecialRates%27`,
        this.spEndPoint),
      showLoader, false);
  }

  public GetEmployeeNamePhotoInfo(userName: string, showLoader: boolean = true): Observable<Response> {
    let data = {
      userName: userName
    }
    return this.http.post(new UrlConfig(`GetEmployeeNamePhotoInfo`, this.customEndPoint), data, showLoader);
  }


  public GetEmployeeInfo(employeeNumber: string, showLoader: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`GetEmployeeInfo/${employeeNumber}`, this.customEndPoint), showLoader);
  }

  public getMyProfileInfo(showLoader: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`GetMyProfileInfo`, this.customEndPoint), showLoader);
  }

  public getEmployeeSalarySlip(showLoader: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`GetMySalaryInfo/${environment.Lang}`, this.customEndPoint), showLoader);
  }

  public getEmployeeObjectivesAndTraining(showLoader: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`GetMyObjectiveTraining`, this.customEndPoint), showLoader);
  }

  public getEmployeeTimeAttendance(pageIndex: number, pageSize: number, showLoader: boolean = true): Observable<Response> {

    let _body = {
      pageNo: pageIndex,
      pageSize: pageSize
    };

    return this.http.post(new UrlConfig(`GetTimeAttendence`, this.customEndPoint), _body, showLoader);
  }



  public logTransaction(titleL: string, url: string, resposeMsg: string, isSuccess: boolean): void {

    let _body: any = {
      '__metadata': {
        'type': 'SP.Data.AlzajelLogsListItem' // it defines the ListEnitityTypeName  
      },
      IsSuccess: isSuccess,
      MessageInfo: `${JSON.stringify(resposeMsg)}`,
      Title: `${titleL}`,
      URL: `${url}`,
      UserName: `${this.ActiveUser.UserName}`
    };

    this.http.post(new UrlConfig(`${this.ListsBase}getbytitle('AlzajelLogs')/items`, this.spEndPoint), JSON.stringify(_body), false).toPromise().then(() => { });
  }

}
