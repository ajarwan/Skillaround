import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AppEnums } from 'src/app/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-notificationdialog',
  templateUrl: './appnotificationdialog.html'
})
export class AppNotificationDialog extends BaseComponent {

  @ViewChild('content', { static: false }) content: any;

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
  constructor(private sharedSVC: SharedService,
    el: ElementRef,
    private modalService: NgbModal) {
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
      setTimeout(() => { this.openModal(); }, 300);
    }
    else
      //this.modal.Show();
      this.openModal();


    if (error)
      console.log(error);
  }


  private confirm() {

    //this.modal.Hide();
    this.modalService.dismissAll()
    if (this.onConfirm)
      this.onConfirm();


  }

  private cancel() {
    // this.modal.Hide();
    this.modalService.dismissAll()
    if (this.onCancel)
      this.onCancel();
  }

  private getConfirmationIcon() {
    switch (this.type) {
      case AppEnums.DialogType.Error:
        return 'glyphicon-remove-sign';
      case AppEnums.DialogType.Warning:
        return 'glyphicon-warning-sign';
      case AppEnums.DialogType.Info:
        return 'glyphicon-info-sign';
      case AppEnums.DialogType.Success:
        return 'glyphicon-ok-sign';
    }
  }

  private getTitle() {
    switch (this.type) {
      case AppEnums.DialogType.Error:
        return this.resources.Confirmation_Error;
      case AppEnums.DialogType.Warning:
        return this.resources.Confirmation_Warning;
      case AppEnums.DialogType.Info:
        return this.resources.Confirmation_Info;
      case AppEnums.DialogType.Success:
        return this.resources.Confirmation_Success;
    }
  }

  private openModal() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
