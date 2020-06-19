import { Injectable } from '@angular/core';
import { HttpInterceptor, UrlConfig } from '../../core/services/http.interceptor';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { Observable } from 'rxjs';
import { CoreEnums } from 'src/app/core/core.enums';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SearchParams } from 'src/app/shared/classes/SearchParams';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly CATEGORY_BASE_URL = 'Api/Category/';

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

    if (criteria.Title) {
      params.set('title', criteria.Title);
    }

    if (criteria.ActivationStatus) {
      params.set('activationStatus', criteria.ActivationStatus);
    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.CATEGORY_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }


}
