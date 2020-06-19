import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


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


  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService,
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
}
