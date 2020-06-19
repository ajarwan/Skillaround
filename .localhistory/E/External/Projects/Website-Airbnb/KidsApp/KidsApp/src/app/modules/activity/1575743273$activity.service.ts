import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../core/services/http.interceptor';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { AppEnums } from 'src/app/app.enums';
import { SearchParams } from 'src/app/shared/classes/SearchParams';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly CATEGORY_BASE_URL = 'Api/Category/';

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
  public FindAllActivities(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, showSpinner: boolean = true): Observable <Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.Title) {
        params.set('title', criteria.Title);
      }

      if (criteria.ActivationStatus) {
        params.set('activationStatus', criteria.ActivationStatus);
      }
    }


    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.CATEGORY_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }



}
