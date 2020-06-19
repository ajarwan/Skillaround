import { Injectable } from '@angular/core';
import { Observable, Subscription, Observer, of } from 'rxjs';

import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { UrlConfig, HttpInterceptor } from 'src/app/core/services/http.interceptor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { User } from '../Classes/User';
import { environment } from 'src/environments/environment';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from './shared.subjects';
import { Localization } from 'src/app/core/services/localization';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  private readonly Message_QUEUE_BASE_URL = 'API/Message/';
  private readonly CONTACT_US_API = 'Api/ContactUs/';
  private readonly GENERAL_API = 'Api/General/';


  constructor(private http: HttpInterceptor, private http2: HttpClient) { }


  /***********************
   *  Helper Methods
   ************************/
  public static ShowNotificationDialog(message: string, type: AppEnums.DialogType, onConfirm?: any, onCancel?: any,
    confirmButtonText?: string, cancelButtonText?: string, error?: any) {
    SharedSubjects.NotificationDialogSubject.next({
      message: message,
      type: type,
      onConfirm: onConfirm,
      onCancel: onCancel,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      error: error
    });
  }


  public GetDayName(day: AppEnums.Days): string {
    switch (day) {
      case AppEnums.Days.Sa:
        return Localization.Saturday;
      case AppEnums.Days.Su:
        return Localization.Sunday;
      case AppEnums.Days.Mo:
        return Localization.Monday;
      case AppEnums.Days.Tu:
        return Localization.Tuesday;
      case AppEnums.Days.We:
        return Localization.Wednesday;
      case AppEnums.Days.Th:
        return Localization.Thursday;
      case AppEnums.Days.Fr:
        return Localization.Friday;

        return '';
    }



  }


  /************************************
   * Message Queue APIs
   * ***********************************/
  public SendMessage(msg: any, showSpinner: boolean = true): Observable<Response> {

    if (environment.IsUATVersion) {
      return of(<any>true).pipe(delay(500));
    }
    return this.http.post(new UrlConfig(`${this.Message_QUEUE_BASE_URL}`, this.mainEndPoint), msg, showSpinner);
  }

  /************************************
  * Contact US APIs
  * ***********************************/

  public AddMessageQueue(msg: any, showSpinner: boolean = true): Observable<Response> {
    if (environment.IsUATVersion) {
      return of(<any>true).pipe(delay(500));
    }
    return this.http.post(new UrlConfig(`${this.CONTACT_US_API}`, this.mainEndPoint), msg, showSpinner);
  }

  /************************************
  * General APIs
  * ***********************************/
  public UploadFile(fileDto: any, showSpinner: boolean = false): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.GENERAL_API}Upload`, this.mainEndPoint), fileDto, showSpinner);
  }

}
