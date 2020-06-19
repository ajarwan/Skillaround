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


      if (criteria.Transportation) {
        params.set('transportation', criteria.Transportation);
      }

      if (criteria.IsPosted) {
        params.set('isPosted', criteria.IsPosted);
      }

      if (criteria.MyActivities) {
        params.set('myActivities', criteria.MyActivities);
      }

      if (criteria.MyActivities) {
        params.set('myActivities', criteria.MyActivities);
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



}
