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
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      onCancel: onCancel,
      error: error
    });
  }



}
