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
import Swal from 'sweetalert2';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

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

    
    return this.http.post(new UrlConfig(`${this.Message_QUEUE_BASE_URL}`, this.mainEndPoint), msg, showSpinner);
  }

  /************************************
  * Contact US APIs
  * ***********************************/

  public AddMessageQueue(msg: any, showSpinner: boolean = true): Observable<Response> {
    
    return this.http.post(new UrlConfig(`${this.CONTACT_US_API}`, this.mainEndPoint), msg, showSpinner);
  }

  /************************************
  * General APIs
  * ***********************************/
  public UploadFile(fileDto: any, showSpinner: boolean = false): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.GENERAL_API}Upload`, this.mainEndPoint), fileDto, showSpinner);
  }

  public static get Lookups(): any {

    return {
      Ages: [
        { Title: environment.Lang == 'ar' ? '3 س - 5 س' : '3 yrs -5 yrs', Id: 1, AgeFrom: 3, AgeTo: 5 },
        { Title: environment.Lang == 'ar' ? '6 س - 9 س' : '6 yrs -9 yrs', Id: 2, AgeFrom: 6, AgeTo: 9 },
        { Title: environment.Lang == 'ar' ? '10 س - 13 س' : '10 yrs -13 yrs', Id: 3, AgeFrom: 10, AgeTo: 13 },
        { Title: environment.Lang == 'ar' ? '14 س - 16 س' : '14 yrs -16 yrs', Id: 4, AgeFrom: 14, AgeTo: 16 },
      ],
      WorkindDays: [
        { Id: -1, Title: DataStore.resources.Day },
        { Id: AppEnums.Days.Sa, Title: Localization.Saturday },
        { Id: AppEnums.Days.Su, Title: Localization.Sunday },
        { Id: AppEnums.Days.Mo, Title: Localization.Monday },
        { Id: AppEnums.Days.Tu, Title: Localization.Tuesday },
        { Id: AppEnums.Days.We, Title: Localization.Wednesday },
        { Id: AppEnums.Days.Th, Title: Localization.Thursday },
        { Id: AppEnums.Days.Fr, Title: Localization.Friday },
      ]
    }

  }

  public static ShowGenericErrorMsg(erMsg: string = null) {
    Swal.fire({
      icon: 'error',
      text: erMsg ? erMsg : DataStore.resources.ErrorInSystem,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: DataStore.resources.Close
    })

  }

  public static EncodeGender(gender: AppEnums.Gender) {
    if (gender == AppEnums.Gender.Male)
      return DataStore.resources.Male;

    return DataStore.resources.Female;
  }

  public static ResponeToDate(res: any) {
    if (!res)
      return '';

    let d = new Date(res);
    d.setHours(5);

    return d;

  }

  public static GetBookingStatus(status: AppEnums.BookingConfirmationStatus) {
    switch (status) {
      case AppEnums.BookingConfirmationStatus.Pending:
        return DataStore.resources.Pending;
      case AppEnums.BookingConfirmationStatus.Confirmed:
        return DataStore.resources.Confirmed;
      case AppEnums.BookingConfirmationStatus.Cancelled:
        return DataStore.resources.Cancelled;
    }
  }

  public static GetBookingStatusColor(status: AppEnums.BookingConfirmationStatus) {
    switch (status) {
      case AppEnums.BookingConfirmationStatus.Pending:
        return 'book-pending';
      case AppEnums.BookingConfirmationStatus.Confirmed:
        return 'book-confirmed';
      case AppEnums.BookingConfirmationStatus.Cancelled:
        return 'book-cancelled';
    }
  }

  public static GetDocumentTypeText(type: AppEnums.DocumentType) {
    switch (type) {
      case AppEnums.DocumentType.PersonalPhoto:
        return DataStore.resources.CompanyLogo;
      case AppEnums.DocumentType.GovermentId:
        return DataStore.resources.PersonalId;
      case AppEnums.DocumentType.NOL:
        return DataStore.resources.NOL;
      case AppEnums.DocumentType.SignedDocument:
        return 'SignedDocument';
      case AppEnums.DocumentType.TradeLicence:
        return DataStore.resources.TradeLicence;
    }
  }
}
