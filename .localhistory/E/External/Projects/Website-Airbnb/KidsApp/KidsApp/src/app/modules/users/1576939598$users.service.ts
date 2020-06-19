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
export class UsersService {

  private get resources() {
    return DataStore.resources;
  }

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  private readonly USER_BASE_URL = 'API/User/';
  private readonly USER_FRIENDS_BASE_URL = 'API/UserFriend/';


  constructor(private http: HttpInterceptor) { }

  /**********************************
   * User APIS
   * *******************************/

  public SignupSM(user: any, showLoader: boolean = true): void {

    let params: SearchParams = new SearchParams();
    if (user.PasswordHash)
      params.set('password', user.PasswordHash);

    this.http.post(new UrlConfig(`${this.USER_BASE_URL}Signup${params.getQuery()}`, this.mainEndPoint), user, showLoader).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res.user, CoreEnums.StorageLocation.LocalStorge);
      DataStore.addUpdate('token', res.token, CoreEnums.StorageLocation.LocalStorge);
      CoreSubjects.onLoginSubject.next(res);

    }, (err: any) => {
      CoreSubjects.onLoginSubject.next({ error: err });
      SharedService.ShowNotificationDialog(this.resources.UserAlreadyExisit, AppEnums.DialogType.Error, null, null, this.resources.Close);
    });
  }

  public Login(email: any, password: any): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}Login?email=${email}&password=${encodeURIComponent(password)}`, this.mainEndPoint), true);
  }

  public CheckEmail(email: string): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}CheckEmail?email=${email}`, this.mainEndPoint), false);
  }

  /**********************************
   * User Fiends APIS
   * *******************************/
  public FindAllMyFriends(pageIndex: number = null, pageSize: number = null, orderBy: string = null): Observable<Response> {

    let params: SearchParams = new SearchParams();

    if (pageIndex)
      params.set('pageIndex', pageIndex.toString());

    if (pageSize)
      params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);


    return this.http.get(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}FindAllMyFriends${params.getQuery()}`, this.mainEndPoint), false);
  }



}
