import { Injectable } from '@angular/core';
import { Observable, Subscription, Observer } from 'rxjs';

import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { UrlConfig, HttpInterceptor } from 'src/app/core/services/http.interceptor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { User } from '../Classes/User';
import { environment } from 'src/environments/environment';
import { AppEnums } from 'src/app/app.enums';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpInterceptor, private http2: HttpClient) { }

  get ActiveUser(): User {
    return (<User>DataStore.get('ActiveUser'));
  }



  private readonly ListsBase = '_api/web/lists/';

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

 


  /***********************
   *  Helper Methods
   ************************/


  
}
