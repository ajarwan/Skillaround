import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';


@Component({
  selector: 'user-myprofile',
  templateUrl: './myprofile.html'
})
export class MyProfile extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public User: any = {};

  public UserValidation: any = {};

  public IsLoading: boolean = false;

  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService,
    public sharedSVC: SharedService,
    public modalService: NgbModal) {
    super();

  }

  public ngOnInit() {

    if (!this.ActiveUser)
      this.navigate('');

    this.LoadUserDetails();



  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUserDetails() {
    this.userSVC.GetActiveUserDetailsDTO().subscribe((res: any) => {
      console.log(res);
      //if(res.DOB)
      //res.DOB = new Date(res.DOB);
      //res.DOB.setHours(9);
      this.User = res;

    })
  }

  public async OnUploadFile(event: any) {
    if (event.target.files[0] && environment.AllowedImagesExtension.toLowerCase().indexOf((event.target.files[0].name.split('.').pop()).toLowerCase()) == -1) {
      return;
    }

    this.User.Image = await this.ConvertToBase64(event.target.files[0]);
  }


  public OnSave() {
    this.UserValidation = {};

    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (Validator.StringIsNullOrEmpty(this.User.LastName))
      this.UserValidation.LastName = true;

    if (Validator.StringIsNullOrEmpty(this.User.Email))
      this.UserValidation.Email = true;

    if (!Validator.IsValidEmail(this.User.Email))
      this.UserValidation.Email = true;

    //if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB))
    //  this.UserValidation.DOB = true;




    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    this.IsLoading = true;
    this.userSVC.UpdateUserDTO(this.User).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
      this.IsLoading = false;

      Swal.fire({
        icon: 'success',
        text: this.resources.SavedSuccessfully,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((res: any) => {
        this.navigate('');
      });
    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((res: any) => {
      });
    })
  }

}
