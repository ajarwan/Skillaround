import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';

declare var $: any;

@Component({
  selector: 'admin-messages',
  templateUrl: './messages.html'
})
export class AdminMessages extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Pager: Pager = new Pager(1, 10, 0, 0);

  public Includes: any[] = [];

  public Msgs: any[] = [];

  public IsLoading: any = false;

  public Tempkeyword: string = '';

  public Keyword: string = '';

  public SelectedMessage: any;
  public MsgText: any = '';
  public InvalidMessage: boolean = false;
  public modalOptions: NgbModalOptions;
  public IsLoadingReply: boolean = false;
  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService,
    public ActivitySVC: ActivityService,
    public modalService: NgbModal) {
    super();
    this.modalOptions = {
      backdrop: 'static',
      size: 'lg',
      centered: true
    }
  }

  public ngOnInit() {

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadData();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {

    this.IsLoading = true;
    this.AdminSVC.FindAllContactUsMessages({ KeyWord: this.Keyword }, this.Pager.PageIndex, this.Pager.PageSize, null, this.Includes.join(''), false).subscribe((res: any) => {
      this.IsLoading = false;
      this.Msgs = res.d;
      this.Pager = res.pager;
    })
  }

  public SetSeen(msg: any) {
    if (msg.IsLoadingUpdate)
      return;

    msg.IsLoadingUpdate = true;
    msg.IsSeen = true;
    this.AdminSVC.UpdateContactUsMessage(msg, false).subscribe((res: any) => {
      msg.IsLoadingUpdate = false;
      Swal.fire({
        icon: 'success',
        text: this.resources.SavedSuccessfully,
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: this.resources.Ok
      });


      let msgsCount = DataStore.get('MessagesCount');
      if (msgsCount && msgsCount > 0) {
        DataStore.addUpdate('MessagesCount', msgsCount - 1);
      }

    }, (err: any) => {
      msg.IsLoadingUpdate = false;
      msg.IsSeen = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });

    })
  }

  public OnPageChange(page: any) {
    this.Pager.PageIndex = page;
    this.LoadData();
  }

  public OnSerach() {

    this.Keyword = this.Tempkeyword;
    this.Pager.PageIndex = 1;

    this.LoadData();
  }

  public OpenReplyModal(msg: any, modal: any) {
    this.SelectedMessage = msg;

    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  public OnSend() {

    this.InvalidMessage = false;
    if (Validator.StringIsNullOrEmpty(this.MsgText) || Validator.RichTextboxIsNullOrEmpty(this.MsgText)) {
      this.InvalidMessage = true;
    }

    if (this.InvalidMessage)
      return;

    this.IsLoadingReply = true;
    let reply: any =
    {
      ContactUsMessageId: this.SelectedMessage.Id,
      Text: this.MsgText,
      ContactUsMessage: this.SelectedMessage
    }

    this.AdminSVC.AddContactUsMessageReply(reply, false).subscribe((res: any) => {
      this.MsgText = '';
      this.SelectedMessage.IsReplied = true;
      this.SelectedMessage = {};
      this.modalService.dismissAll();
      this.IsLoadingReply = false;
      Swal.fire({
        icon: 'success',
        text: this.resources.SentSuccessfully,
        timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      })


    }, (err: any) => {
      this.IsLoadingReply = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    });
  }

  public OnCancel() {
    this.modalService.dismissAll();
  }

}
