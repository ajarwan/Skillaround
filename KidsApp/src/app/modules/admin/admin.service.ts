import { Injectable } from '@angular/core';
import { HttpInterceptor, UrlConfig } from '../../core/services/http.interceptor';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { Observable, of } from 'rxjs';
import { CoreEnums } from 'src/app/core/core.enums';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SearchParams } from 'src/app/shared/classes/SearchParams';
import { environment } from 'src/environments/environment';
import { Pager } from 'src/app/shared/classes/Pager';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly CATEGORY_BASE_URL = 'Api/Category/';
  private readonly DASHBOARD_BASE_URL = 'Api/Dashboard/';
  private readonly CONTACT_US_BASE_URL = 'Api/ContactUs/';
  private readonly CONTENT_ADMIN_BASE_URL = 'Api/ContentAdmin/';
  private readonly CONTACTUS_REPLY_BASE_URL = 'Api/ContactUsMessageReply/';
  private readonly OUTGOING_EMAIL_BASE_URL = 'Api/OutgoingEmail/';

  private get resources() {
    return DataStore.resources;
  }

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  constructor(private http: HttpInterceptor) { }


  /**********************************
   * Categories APIS
   * *********************************/
  public FindAllCategories(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.Title) {
        params.set('title', criteria.Title);
      }

      if (criteria.ActivationStatus) {
        params.set('activationStatus', criteria.ActivationStatus);
      }
    }

    if (pageIndex)
      params.set('pageIndex', pageIndex.toString());
    if (pageSize)
      params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.CATEGORY_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public UpdateCategory(cat: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.CATEGORY_BASE_URL}`, this.mainEndPoint), cat, showSpinner);
  }

  public AddCategory(cat: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.CATEGORY_BASE_URL}`, this.mainEndPoint), cat, showSpinner);
  }

  /**********************************
   * Dashboard APIS
   * *********************************/
  public FindDashboardCounts(showSpinner: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`${this.DASHBOARD_BASE_URL}Counts`, this.mainEndPoint), showSpinner);
  }

  public FindMostRatedSuppliers(showSpinner: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`${this.DASHBOARD_BASE_URL}MostRatedSuppliers`, this.mainEndPoint), showSpinner);
  }


  /**********************************
   * Contact US APIS
   * *********************************/
  public FindAllContactUsMessages(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {

      if (criteria.SeenStatus) {
        params.set('seenStatus', criteria.SeenStatus);
      }

      if (criteria.KeyWord) {
        params.set('keyWord', criteria.KeyWord);
      }

    }

    if (pageIndex)
      params.set('pageIndex', pageIndex.toString());
    if (pageSize)
      params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.CONTACT_US_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }


  public UpdateContactUsMessage(msg: any, showSpinner: boolean = true): Observable<Response> {

    return this.http.put(new UrlConfig(`${this.CONTACT_US_BASE_URL}`, this.mainEndPoint), msg, showSpinner);
  }

  public FindContacUsMessagesCount(): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.CONTACT_US_BASE_URL}Count`, this.mainEndPoint), false);
  }

  /**********************************
  * Categories APIS
  * *********************************/
  public FindContentAdminByType(type: AppEnums.ContentAdminType, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();
    params.set('type', type.toString());

    return this.http.get(new UrlConfig(`${this.CONTENT_ADMIN_BASE_URL}FindByType${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public UpdateContentAdmin(contentAdmin: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.CONTENT_ADMIN_BASE_URL}`, this.mainEndPoint), contentAdmin, showSpinner);
  }

  /**********************************
  * Contact US Reply
  * *********************************/
  public AddContactUsMessageReply(reply: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.CONTACTUS_REPLY_BASE_URL}`, this.mainEndPoint), reply, showSpinner);
  }

  /**********************************
   * Outgoing Email API
   * *********************************/
  public AddOutgoingEmail(email: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.OUTGOING_EMAIL_BASE_URL}`, this.mainEndPoint), email, showSpinner);
  }
}
