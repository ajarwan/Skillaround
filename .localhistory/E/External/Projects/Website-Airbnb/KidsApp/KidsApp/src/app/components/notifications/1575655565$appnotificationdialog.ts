import { Component, OnInit, ElementRef } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AppEnums } from 'src/app/app.enums';
@Component({
  selector: 'app-notificationdialog',
  templateUrl: './appnotificationdialog.html'
})
export class AppNotificationDialog extends BaseComponent {


  public confirmationType = AppEnums.DialogType;

  public onConfirm: any
  public onCancel: any

  public message: string;
  public type: AppEnums.DialogType;
  public showCancelButton: boolean;
  public confirmButtonText: string;
  public cancelButtonText: string;


  public title: string
  public elem: HTMLElement;
  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService, el: ElementRef) {
    super();
    this.elem = el.nativeElement;

  }

  public Show(message: string, type: AppEnums.DialogType, onConfirm: any, onCancel?: any,
    confirmButtonText?: string, cancelButtonText?: string, error?: any) {
    this.message = message;
    this.type = type;
    confirmButtonText != null ? this.confirmButtonText = confirmButtonText : this.confirmButtonText = this.resources.GeneralYes;
    cancelButtonText != null ? this.cancelButtonText = cancelButtonText : this.cancelButtonText = this.resources.GeneralNo;

    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    if (type == AppEnums.DialogType.Error) {
      //setTimeout(() => { this.modal.Show(); }, 300);
    }
    else
      //this.modal.Show();


      if (error)
        console.log(error);
  }


  public Confirm() {

    //this.modal.Hide();

    if (this.onConfirm)
      this.onConfirm();


  }

  public Cancel() {
    // this.modal.Hide();

    if (this.onCancel)
      this.onCancel();


  }
}
