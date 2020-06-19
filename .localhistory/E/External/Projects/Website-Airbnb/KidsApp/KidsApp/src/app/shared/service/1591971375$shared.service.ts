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
import { SearchParams } from '../classes/SearchParams';

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
  private readonly STATISTICS_API = 'Api/Statistic/';


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
    return this.http.PostFile(new UrlConfig(`${this.GENERAL_API}Upload`, this.mainEndPoint), fileDto.File, showSpinner);
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

  public static IsMobile() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  }
  /*************************************
   * Statistics API
   * ***********************************/
  public AddStatistic(stat: any, showSpinner: boolean = true): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.STATISTICS_API}`, this.mainEndPoint), stat, showSpinner);
  }

  public AddStatistics(stats: any[], showSpinner: boolean = true): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.STATISTICS_API}List`, this.mainEndPoint), stats, showSpinner);
  }

  public FindSupplierActivityViewStatistics(activityId: number, showSpinner: boolean = true): Observable<Response> {
    var params = new SearchParams();
    params.set('activityId', activityId.toString());
    return this.http.get(new UrlConfig(`${this.STATISTICS_API}ActivityViewStatistics${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public FindMostActiveUsers(showSpinner: boolean = true): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.STATISTICS_API}MostActiveUsers`, this.mainEndPoint), showSpinner);
  }

  public FindMostViewedActivities(showSpinner: boolean = true): Observable<Response> {

    return this.http.get(new UrlConfig(`${this.STATISTICS_API}MostViewedActivities`, this.mainEndPoint), showSpinner);
  }


}
