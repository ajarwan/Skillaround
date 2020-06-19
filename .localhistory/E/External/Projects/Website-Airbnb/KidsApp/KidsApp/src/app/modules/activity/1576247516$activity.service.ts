import { Injectable } from '@angular/core';
import { HttpInterceptor, UrlConfig } from '../../core/services/http.interceptor';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { AppEnums } from 'src/app/app.enums';
import { SearchParams } from 'src/app/shared/classes/SearchParams';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly ACTIVITY_BASE_URL = 'Api/Activity/';
  private readonly REVIEWE_BASE_URL = 'Api/Review/';
  private readonly ACTIVITY_DOCUMRNT_BASE_URL = 'Api/ActivityDocument/';

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  constructor(private http: HttpInterceptor) { }

  /*************************************
   * Activity APIs
   * **********************************/
  public FindAllActivities(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.Title) {
        params.set('title', criteria.Title);
      }

      if (criteria.Description) {
        params.set('description', criteria.Description);
      }

      if (criteria.LocationId) {
        params.set('locationId', criteria.LocationId);
      }

      if (criteria.LocationName) {
        params.set('locationName', criteria.LocationName);
      }

      if (criteria.AgeFrom) {
        params.set('ageFrom', criteria.AgeFrom);
      }

      if (criteria.AgeTo) {
        params.set('ageTo', criteria.AgeTo);
      }

      if (criteria.FromDate) {
        params.set('fromDate', criteria.FromDate);
      }

      if (criteria.ToDate) {
        params.set('toDate', criteria.ToDate);
      }


      if (criteria.TransportationStatus) {
        params.set('transportation', criteria.TransportationStatus);
      }

      if (criteria.IsPosted) {
        params.set('isPosted', criteria.IsPosted);
      }

      if (criteria.MyActivities) {
        params.set('myActivities', criteria.MyActivities);
      }


      if (criteria.Category) {
        params.set('categoryId', criteria.Category.Id);
      }


      if (criteria.MaxPrice) {
        params.set('maxPrice', criteria.MaxPrice);
      }


      if (criteria.MinPrice) {
        params.set('minPrice', criteria.MinPrice);
      }



    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public FindActivityPriceRange(showSpinner: boolean = true): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}PriceRange`, this.mainEndPoint), showSpinner);
  }

  public FindActivityById(id: number, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (include)
      params.set('include', include.toString());


    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}${id}${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  /*************************************
   * Reviews APIs
   * **********************************/
  public FindActivityReviewStatistics(activityId: any, showSpinner: boolean = false) {
    var params = new SearchParams();
    params.set('ActivityId', activityId);

    return this.http.get(new UrlConfig(`${this.REVIEWE_BASE_URL}FindActivityReviewStatistics${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }


  /*************************************
   * Activity Documents
   * **********************************/
  public FindAllActivityDocuments(activityId: any, showSpinner: boolean = false) {
    var params = new SearchParams();
    params.set('ActivityId', activityId);

     

    return this.http.get(new UrlConfig(`${this.ACTIVITY_DOCUMRNT_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }


}
