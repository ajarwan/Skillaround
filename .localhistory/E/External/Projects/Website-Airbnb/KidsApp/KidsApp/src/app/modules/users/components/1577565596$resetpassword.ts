import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute } from '@angular/router';


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
  public ResetError: boolean = false;

  public InvalidURL: boolean = false;


  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService, public route: ActivatedRoute) {
    super();


  }

  public ngOnInit() {
    this.UniqueId = this.route.snapshot.params['id'];

    this.LoadUser();
  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUser() {
    if (!this.UniqueId) {
      this.InvalidURL = true;
      return;
    }

    this.userSVC.FindUserByUniqueId(this.UniqueId, true).subscribe((res: any) => {
      if (res) {
        this.User = res;
      }
      else {

        this.InvalidURL = true;
      }

    });


  }


  public ResetPassword() {

    this.ResetError = false;


    this.UserValidation = {};


    if (Validator.StringIsNullOrEmpty(this.User.PasswordHash))
      this.UserValidation.PasswordHash = true;

    if (Validator.StringIsNullOrEmpty(this.User.PasswordHash2))
      this.UserValidation.PasswordHash2 = true;

    if (!Validator.StringIsNullOrEmpty(this.User.PasswordHash)
      && !Validator.StringIsNullOrEmpty(this.User.PasswordHash2)
      && (this.User.PasswordHash != this.User.PasswordHash2)) {
      this.UserValidation.PasswordMisMatch = true;
    }

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    if (this.User.PasswordHash.length < 8)
      this.UserValidation.PasswordLength = true;


    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;

    this.userSVC.ResetPassword(this.UniqueId, this.User.PasswordHash).subscribe((res: any) => {
      if (res) {

        Swal.fire({
          icon: 'success',
          text: this.resources.ResetPasswordSavedSuccessfully,
          timer: 2500,
          showConfirmButton: true,
          confirmButtonText: this.resources.Close
        }).then((res: any) => {
          this.navigate('');
        })


      }

    }, (err: any) => {
      this.ResetError = true;
    });
  }

}
