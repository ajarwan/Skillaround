import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';


enum ModalType {
  Email = 1,
  Message = 2
}
@Component({
  selector: 'user-mynetwork',
  templateUrl: './mynetwork.html'
})
export class MyNetwork extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Pager: Pager = new Pager(1, 9, 0, 0);
  public Users: any[] = [];

  public modalOptions: NgbModalOptions;
  public ModalType = ModalType;

  public CurrentModalType = ModalType.Email;

  public SelectedUser: any = {};
  public MsgText: string = '';
  public InvalidMessage: boolean = false;


  public IsLoadingSuggestedUsers = false;
  public SuggestedUsers: any[] = [];
  public SuggestedUsersPager: Pager = new Pager(1, 10, 0, 0);
  public SuggestedError = false;
  public SearchKeyword = '';
  public SearchSuggestedCriteria: any = {
    SearchForConnect: this.ActiveUser.Id
  };
  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService,
    public sharedSVC: SharedService,
    public modalService: NgbModal) {
    super();
    this.modalOptions = {
      backdrop: 'static',
      size: 'lg',
      centered: true
    }
  }

  public ngOnInit() {

    if (!this.ActiveUser) {
      this.navigate('/');
      return;

    }


    this.LoadData()

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {
    this.userSVC.FindAllMyFriends(this.Pager.PageIndex, this.Pager.PageSize).subscribe((res: any) => {
      this.Users = res.d;
      this.Pager = res.pager;
    })
  }

  public OnPageChange(page: number) {
    this.Pager.PageIndex = page;
    this.LoadData();
  }

  public OnDeleteConfirm(userId: number) {

    Swal.fire({
      icon: 'question',
      text: this.resources.Areyousuretodisconnect,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.resources.GeneralYes,
      cancelButtonText: this.resources.GeneralNo
    }).then((res: any) => {
      if (res.value) {
        this.userSVC.RemoveFriend(userId).subscribe((res: any) => {
          this.Pager.PageIndex = 1;
          this.LoadData()
        })
      }
    })


  }


  public OpenSendEmailMessageModal(user: any, type: ModalType, modal: any) {
    this.SelectedUser = user;
    this.CurrentModalType = type;

    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public OnCancel() {
    this.modalService.dismissAll();
  }

  public OnSend() {

    this.InvalidMessage = false;
    if (Validator.StringIsNullOrEmpty(this.MsgText)) {
      this.InvalidMessage = true;
    }

    if (this.InvalidMessage)
      return;

    let Msg: any =
    {
      ToUserId: this.SelectedUser.Id,
      Message: this.MsgText,
      MessageType: this.CurrentModalType
    }

    this.sharedSVC.SendMessage(Msg, true).subscribe((res: any) => {
      this.MsgText = '';
      this.modalService.dismissAll();

      Swal.fire({
        icon: 'success',
        text: this.resources.SentSuccessfully,
        timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      })


    });
  }

  public OpenSearchModal(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public OnSearchSuggestedUsers() {
    if (Validator.StringIsNullOrEmpty(this.SearchKeyword)) {
      this.SuggestedError = true;
      return;
    }
    this.SearchSuggestedCriteria.Keyword = this.SearchKeyword;
    this.SuggestedUsersPager.PageIndex = 1;
    this.SuggestedUsers = []
    this.LoadSuggestedUsers();
  }

  public LoadSuggestedUsers() {
    this.IsLoadingSuggestedUsers = true;

    this.userSVC.FindAllUsers(this.SearchSuggestedCriteria, this.SuggestedUsersPager.PageIndex, this.SuggestedUsersPager.PageSize,
      "CreateDate DESC, Id DESC", null, false).subscribe((res: any) => {
        this.IsLoadingSuggestedUsers = false;

        this.SuggestedUsersPager = res.pager;

        if (!this.SuggestedUsers)
          this.SuggestedUsers = []

        this.SuggestedUsers = this.SuggestedUsers.concat(res.d)
      }, (err: any) => {
        this.IsLoadingSuggestedUsers = false;
        Swal.fire({
          icon: 'error',
          text: this.resources.ErrorInSystem,
          //timer: 2500,
          showConfirmButton: true,
          confirmButtonText: this.resources.Close
        })
      })
  }

  public LoadMoreSuggestedUsers() {
    this.SuggestedUsersPager.PageIndex += 1;
    this.LoadSuggestedUsers();
  }
}
