import { Injectable } from '@angular/core';
import { HttpInterceptor, UrlConfig } from '../../core/services/http.interceptor';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  private readonly USER_BASE_URL = 'API/User/';
  constructor(private http: HttpInterceptor) { }


  public Signup(user: any, showLoader: boolean = true): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.USER_BASE_URL}Signup`, this.mainEndPoint), user, showLoader);
  }


  public Login(email: any, password: any): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}Login`, this.mainEndPoint), user, showLoader);
  }

}
