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
import { SharedSubjects } from './shared.subjects';
import { Localization } from 'src/app/core/services/localization';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

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

}
