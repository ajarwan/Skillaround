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
  selector: 'user-activate',
  templateUrl: './activate.html'
})
export class ActivateUser extends BaseComponent implements OnInit {

  /******************************************
   * Properties
   * ***************************************/
  public UniqueId: string = '';
  public User: any = {};
  public UserValidation: any = {};
  public ResetError: boolean = false;

  public InvalidURL: boolean = false;
  public ShowSpinner: boolean = false;


  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService, public route: ActivatedRoute) {
    super();


  }

  public ngOnInit() {
    this.UniqueId = this.route.snapshot.params['id'];

    this.ActivateUser();
  }

  /*************************************
   *  Methods
   *************************************/
  public ActivateUser() {
    if (!this.UniqueId) {
      this.InvalidURL = true;
      return;
    }

    this.userSVC.ActivateUser(this.UniqueId, true).subscribe((res: any) => {
      if (res) {
        this.User = res;

        Swal.fire({
          icon: 'success',
          text: this.resources.ResetPasswordSavedSuccessfully,
          showConfirmButton: true,
          confirmButtonText: this.resources.Close
        }).then((res: any) => {
          this.navigate('');
        })
      }
      else {
        this.InvalidURL = true;
      }

    });


  }

}
