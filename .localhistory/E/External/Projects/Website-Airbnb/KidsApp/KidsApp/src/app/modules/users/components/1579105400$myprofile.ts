import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';


@Component({
  selector: 'user-myprofile',
  templateUrl: './myprofile.html'
})
export class MyProfile extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/

  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService,
    public sharedSVC: SharedService,
    public modalService: NgbModal) {
    super();

  }

  public ngOnInit() {

    this.LoadUserDetails();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUserDetails() {
    this.userSVC.GetActiveUserDetails().subscribe((res: any) => {
      console.log(res);
    })
  }

}
