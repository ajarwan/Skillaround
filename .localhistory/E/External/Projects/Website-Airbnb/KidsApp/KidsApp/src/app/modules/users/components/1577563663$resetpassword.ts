import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute } from '@angular/router';


enum ModalType {
  Email = 1,
  Message = 2
}
@Component({
  selector: 'user-resetpassword',
  templateUrl: './resetpassword.html'
})
export class ResetPassword extends BaseComponent implements OnInit {

  /******************************************
   * Properties
   * ***************************************/
  public UniqueId: string = '';
  public User: any = {};
  public UserValidation: any = {};

  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService, public route: ActivatedRoute) {
    super();


  }

  public ngOnInit() {
    this.UniqueId = this.route.snapshot.params['id'];

  }

  /*************************************
   *  Methods
   *************************************/



}
