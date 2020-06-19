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

  public SelectedMonth = -1;
  public SelectedDay: any = 'Day';
  public SelectedYear: any = 'Year';
  public Months: any[] = [
    { Id: -1, Title: 'Month' },
    { Id: 0, Title: 'Jan' },
    { Id: 1, Title: 'Feb' },
    { Id: 2, Title: 'Mar' },
    { Id: 3, Title: 'Apr' },
    { Id: 4, Title: 'May' },
    { Id: 5, Title: 'Jun' },
    { Id: 6, Title: 'July' },
    { Id: 7, Title: 'Aug' },
    { Id: 8, Title: 'Sep' },
    { Id: 9, Title: 'Oct' },
    { Id: 10, Title: 'Nov' },
    { Id: 11, Title: 'Dec' }
  ];
  public Days: any = [];
  public Years: any = [];

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

    this.Days.push('Day');
    for (let i: number = 1; i < 32; i++) {
      this.Days.push(i);
    }

    this.Years.push('Year');
    for (let i: number = 1940; i < 2020; i++) {
      this.Years.push(i);
    }

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUserDetails() {
    this.userSVC.GetActiveUserDetailsDTO().subscribe((res: any) => {
      console.log(res);
      this.User = res;

      if (this.User.DOB) {
        let date = new Date(this.User.DOB);
        this.SelectedDay = new Date(this.User.DOB).getDate();
        this.SelectedMonth = new Date(this.User.DOB).getMonth();
        this.SelectedYear = new Date(this.User.DOB).getFullYear();
      }
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



    if (this.SelectedDay == 'Day' || this.SelectedMonth == -1 || this.SelectedYear == 'Year') {
      this.UserValidation.Birthday = true;
    }

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;

    this.User.DOB = new Date(<number>this.SelectedYear, this.SelectedMonth, this.SelectedDay);

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
    })
  }

}
