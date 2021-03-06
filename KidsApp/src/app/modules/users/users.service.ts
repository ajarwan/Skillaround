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
import { delay } from 'rxjs/operators';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';

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

  private readonly USER_BASE_URL = 'Api/User/';
  private readonly USER_FRIENDS_BASE_URL = 'Api/UserFriend/';
  private readonly USER_DOCUMENTS_BASE_URL = 'Api/UserDocument/';
  private readonly KIDS_BASE_URL = 'Api/Kid/';
  private readonly NOTIFICATIONS_BASE_URL = 'Api/Notification/';

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
      //SharedService.ShowNotificationDialog(this.resources.UserAlreadyExisit, AppEnums.DialogType.Error, null, null, this.resources.Close);
      Swal.fire({
        icon: 'error',
        text: this.resources.UserAlreadyExisit,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    });
  }

  public Login(email: any, password: any): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}Login?email=${email}&password=${encodeURIComponent(password)}`, this.mainEndPoint), true);
  }

  public CheckEmail(email: string): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}CheckEmail?email=${email}`, this.mainEndPoint), false);
  }

  public ForgetPassword(email: string): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}ForgetPassword?email=${email}`, this.mainEndPoint), false);
  }

  public FindUserByUniqueId(uniqueId: string, showLoader: boolean = true): Observable<Response> {

    let params = new SearchParams();
    params.set('uniqueId', uniqueId);


    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}FindUserByUniqueId${params.getQuery()}`, this.mainEndPoint), showLoader);
  }

  public ResetPassword(uniqueId: string, password: string): Observable<Response> {

    let params = new SearchParams();
    params.set('uniqueId', uniqueId);
    params.set('password', password);


    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}ResetPassword${params.getQuery()}`, this.mainEndPoint), false);
  }

  public ActivateUser(uniqueId: string, showLoader: boolean = true): Observable<Response> {

    let params = new SearchParams();
    params.set('uniqueId', uniqueId);


    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}ActivateUser${params.getQuery()}`, this.mainEndPoint), showLoader);
  }

  public RegisterSupplier(user: any): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.USER_BASE_URL}RegisterSupplier?password=${user.PasswordHash}`, this.mainEndPoint), user, true);
  }

  public GetActiveUserDetailsDTO(showLoader: boolean = true): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}DetailsDTO`, this.mainEndPoint), showLoader);
  }

  public GetUserDetails(include: any, showLoader: boolean = true): Observable<Response> {
    var params = new SearchParams();
    if (include)
      params.set('include', include.toString());
    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}Details${params.getQuery()}`, this.mainEndPoint), showLoader);
  }

  public UpdateUserDTO(userDTO: any): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.USER_BASE_URL}DetailsDTO`, this.mainEndPoint), userDTO, false);
  }

  public UpdateSupplierInfo(user: any, showLoader: boolean = false): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.USER_BASE_URL}UpdateSupplier`, this.mainEndPoint), user, showLoader);
  }

  public FindAllUsers(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.Keyword) {
        params.set('keyword', criteria.Keyword);
      }

      if (criteria.Types && criteria.Types.length > 0) {
        params.set('types', criteria.Types.join(','));
      }


      if (criteria.SearchForConnect) {
        params.set('searchForConnect', criteria.SearchForConnect);
      }


    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.USER_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public UpdateUser(user: any, showLoader: boolean = false): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.USER_BASE_URL}Update`, this.mainEndPoint), user, showLoader);
  }

  private KeepAliveService(): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.USER_BASE_URL}KeepAlive`, this.mainEndPoint), {}, false);
  }

  public KeepAlive() {

    if (DataStore.get('ActiveUser')) {
      this.KeepAliveService().subscribe((res: any) => { });
    }
    else
      return;

    var kepInt = setInterval(() => {
      if (DataStore.get('ActiveUser')) {
        this.KeepAliveService().subscribe((res: any) => { });
      }
      else {
        clearInterval(kepInt)
      }
    },
      environment.KeepAliveInterval
    )

  }


  /**********************************
   * User Friends APIS
   * *******************************/
  public FindAllMyFriends(pageIndex: number = null, pageSize: number = null, orderBy: string = null, showSpinner: boolean = true): Observable<Response> {

    let params: SearchParams = new SearchParams();

    if (pageIndex)
      params.set('pageIndex', pageIndex.toString());

    if (pageSize)
      params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);


    return this.http.get(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}FindAllMyFriends${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public RemoveFriend(userId: number): Observable<Response> {

    if (environment.IsUATVersion) {
      return of(<any>true).pipe(delay(500));
    }

    let params: SearchParams = new SearchParams();

    params.set('userId', userId.toString());




    return this.http.get(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}RemoveFriend${params.getQuery()}`, this.mainEndPoint), false);
  }

  public IsConnected(userId: number): Observable<Response> {

    let params: SearchParams = new SearchParams();

    params.set('userId', userId.toString());

    return this.http.get(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}IsConnected${params.getQuery()}`, this.mainEndPoint), false);
  }

  public ConnectUsers(userFriend: number): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}`, this.mainEndPoint), userFriend, false);
  }

  public UpdateUserFriend(userFriend: number, showSpinner: boolean = false): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.USER_FRIENDS_BASE_URL}`, this.mainEndPoint), userFriend, showSpinner);
  }


  /**********************************
   * User Documents
   * *******************************/
  public FindAllMyDocuments(showSpinner: boolean = true): Observable<Response> {
    return this.http.get(new UrlConfig(`${this.USER_DOCUMENTS_BASE_URL}FindAllMyDocuments`, this.mainEndPoint), showSpinner);
  }

  public FindAllDocuments(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.UserId) {
        params.set('userId', criteria.UserId);
      }

    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);
    return this.http.get(new UrlConfig(`${this.USER_DOCUMENTS_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public UpdateUserDocument(doc: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.USER_DOCUMENTS_BASE_URL}`, this.mainEndPoint), doc, showSpinner);
  }

  public AddUserDocument(doc: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.USER_DOCUMENTS_BASE_URL}`, this.mainEndPoint), doc, showSpinner);
  }

  public DeleteUserDocument(docId: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.delete(new UrlConfig(`${this.USER_DOCUMENTS_BASE_URL}${docId}`, this.mainEndPoint), showSpinner);
  }

  /**********************************
   * Kids API
   * *******************************/
  public FindAllKids(criteria: any, pageIndex: number = null, pageSize: number = null, orderBy: string = null, showSpinner: boolean = true): Observable<Response> {

    let params: SearchParams = new SearchParams();

    if (criteria) {
      if (criteria.ParentId) {
        params.set('parentId', criteria.ParentId);
      }
    }

    if (pageIndex)
      params.set('pageIndex', pageIndex.toString());

    if (pageSize)
      params.set('pageSize', pageSize.toString());

    if (orderBy)
      params.set('orderBy', orderBy);


    return this.http.get(new UrlConfig(`${this.KIDS_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public UpdateKid(kid: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.KIDS_BASE_URL}`, this.mainEndPoint), kid, showSpinner);
  }

  public AddKid(kid: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.KIDS_BASE_URL}`, this.mainEndPoint), kid, showSpinner);
  }

  public DeleteKid(kid: any, showSpinner: boolean = true): Observable<Response> {

    return this.http.delete(new UrlConfig(`${this.KIDS_BASE_URL}/${kid.Id}`, this.mainEndPoint), showSpinner);
  }



  /**********************************
   * Notification API
   * *******************************/
  public FindNotificationsCount(): Observable<Response> {
    return this.http.get(new UrlConfig(`${this.NOTIFICATIONS_BASE_URL}Count`, this.mainEndPoint), false);
  }

  public FindAllNotifications(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {

      if (criteria.Status) {
        params.set('status', criteria.Status);
      }
      else if (criteria.Status == 0)
        params.set('status', '0');

      if (criteria.Type) {
        params.set('type', criteria.Type);
      }
      else if (criteria.Type == 0)
        params.set('type', '0');

    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.NOTIFICATIONS_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public LoadNotificationCount() {
    if (DataStore.get('ActiveUser')) {

      this.FindNotificationsCount().subscribe((res: any) => {
        DataStore.addUpdate('NotificationsCount', res);
      });
    }
    else
      return;

    var NotificationInt = setInterval(() => {
      if (DataStore.get('ActiveUser')) {
        this.FindNotificationsCount().subscribe((res: any) => {
          DataStore.addUpdate('NotificationsCount', res);
        });
      }
      else {
        clearInterval(NotificationInt)
      }
    },
      environment.LoadNotificationsInterval
    )
  }

  public MapNotification(notifications: any[]) {
    if (!notifications || notifications.length == 0)
      return [];

    let res = [];

    notifications.forEach((x: any) => {
      switch (x.Type) {
        case AppEnums.NotificationType.SystemNotification:
          x.Icon = 'assets/images/logo.png';
          x.Header = DataStore.resources.SystemNotification;
          x.Subject = x.Text;
          break;
        case AppEnums.NotificationType.UserMessage:
          x.Icon = x.FromUser.Image;
          x.Header = x.FromUser.FullName + ' ' + DataStore.resources.SentYouAMessage;
          x.Subject = x.MessagingQueue.Message;
          break;
        case AppEnums.NotificationType.ConnectRequest:
          x.Icon = x.FromUser.Image;
          x.Header = x.FromUser.FullName + ' ' + DataStore.resources.SentYouAConnectRequest;
          x.Subject = '';
          break;
        case AppEnums.NotificationType.Booking:
          x.Icon = x.RelatedBooking.Activity.Thumbnail.File;
          x.Header = x.RelatedBooking.Activity.Title;
          x.Subject =
            x.RelatedBooking.Status == AppEnums.BookingConfirmationStatus.Confirmed ? DataStore.resources.YourBookingHasBeenConfirmed : DataStore.resources.YourBookingHasBeenCancelled;
          break;
        case AppEnums.NotificationType.ConnectRequestApproval:
          x.Icon = x.FromUser.Image;
          x.Header = x.FromUser.FullName + ' ' + DataStore.resources.AcceptYourConnectRequest;
          x.Subject = '';
          break;
      }
    });

    return notifications;
  }

  public SetSeenNotification(showSpinner: boolean = false): Observable<Response> {
    return this.http.get(new UrlConfig(`${this.NOTIFICATIONS_BASE_URL}SetSeenNotification`, this.mainEndPoint), showSpinner);
  }


  /**********************************
   * Payment APIs
   * *******************************/
  public SaveToken(token: any): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.USER_BASE_URL}SaveToken`, this.mainEndPoint), token, true);
  }
}
