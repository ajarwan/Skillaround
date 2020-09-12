import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { Validator } from 'src/app/core/services/validator';

declare var $: any;

enum MailReceiverType {
  All = 1,
  Users = 2,
  Suppliers = 3,
  Admins = 4
}
@Component({
  selector: 'admin-mailers',
  templateUrl: './mailers.html'
})
export class Mailers extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public IsLoading: boolean = false;
  public Invalid: boolean = false;
  public MailReceiverType = MailReceiverType;
  public InvalidSubject: boolean = false;
  public Content: any = {};

  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService) {
    super();

  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

  public OnSend(type: MailReceiverType) {

    if (Validator.StringIsNullOrEmpty(this.Content.Subject)) {
      this.InvalidSubject = true;
      return;
    }
    else
      this.InvalidSubject = false;

    if ((!this.Content.TextAr || Validator.RichTextboxIsNullOrEmpty(this.Content.TextAr)) &&
      (!this.Content.TextEn || Validator.RichTextboxIsNullOrEmpty(this.Content.TextEn))) {
      this.Invalid = true;
      return;
    }
    else
      this.Invalid = false;


    this.IsLoading = true;


    let email: any = {
      TextAr: this.Content.TextAr,
      TextEn: this.Content.TextEn,
      Subject: this.Content.Subject,
      MailReceiverType: type
    }
    this.AdminSVC.AddOutgoingEmail(email, false).subscribe((res: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'success',
        text: this.resources.EmailQueuedUpAndWillBeSendShortly,
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: this.resources.Ok
      });
    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    });
  }
}
