import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { User } from 'src/app/shared/Classes/User';
import { AppEnums } from 'src/app/app.enums';
import { Localization } from 'src/app/core/services/localization';
import { Validator } from 'src/app/core/services/validator';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import Swal from 'sweetalert2';


declare var $: any;
declare var MtrDatepicker: any;

@Component({
  selector: 'suppliers-supplierinfo',
  templateUrl: './supplierinfo.html'
})
export class SupplierInfo extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public User: any = {};
  public UserValidation: any = {};
  public IsLoading = false;

  public Documents: any = [];
  public PersonalPhoto: any = null;
  public GovermentId: any = null;
  public TradeLicence: any = null;


  public WorkindDays: any[] = [
    { Id: AppEnums.Days.Sa, Title: Localization.Saturday },
    { Id: AppEnums.Days.Su, Title: Localization.Sunday },
    { Id: AppEnums.Days.Mo, Title: Localization.Monday },
    { Id: AppEnums.Days.Tu, Title: Localization.Tuesday },
    { Id: AppEnums.Days.We, Title: Localization.Wednesday },
    { Id: AppEnums.Days.Th, Title: Localization.Thursday },
    { Id: AppEnums.Days.Fr, Title: Localization.Friday },
  ]

  public SelectedStartDay = 1;
  public SelectedEndDay = 1;
  public SelectedStartTime: any;
  public SelectedEndTime: any;

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService) {
    super();

  }

  public ngOnInit() {

    this.LoadUserDetails();
    this.LoadUserDocuments()

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUserDetails() {
    this.userSVC.GetUserDetails().subscribe((res: any) => {
      if (!res)
        this.navigate('');

      this.User = res;

      this.SelectedStartDay = this.User.SupplierStatrtWorkingDay;
      this.SelectedEndDay = this.User.SupplierEndWorkingDay;
      //this.SelectedStartTime = new Date();
      //this.SelectedEndTime = new Date();

      this.InitTimePickers();
    });
  }

  public LoadUserDocuments() {
    this.userSVC.FindAllMyDocuments(true).subscribe((res: any) => {
      this.Documents = res;

      this.PersonalPhoto = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto)[0];
      this.GovermentId = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.GovermentId)[0];
      this.TradeLicence = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.TradeLicence)[0];

    })
  }

  public InitTimePickers() {

    let startdate = new Date();
    let endDate = new Date();

    if (this.User.StartWorkingTime) {
      let hours = this.User.StartWorkingTime.split(':')[0]
      let mins = this.User.StartWorkingTime.split(':')[1]

      startdate.setHours(hours);
      startdate.setMinutes(mins);
    }

    if (this.User.EndWorkingTime) {
      let hours = this.User.EndWorkingTime.split(':')[0]
      let mins = this.User.EndWorkingTime.split(':')[1]

      endDate.setHours(hours);
      endDate.setMinutes(mins);
    }

    let sconfig = {
      target: 'startTimePicker',
      smartHours: true,                // Make a smart switch from AM to PM
      animations: true,
      timestamp: startdate.getTime(),
      minutes: {
        min: 0,
        max: 59,
        step: 1
      },
      hours: {
        min: 0,
        max: 11,
        step: 1
      }
    };

    let econfig = {
      target: 'endTimePicker',
      smartHours: true,                // Make a smart switch from AM to PM
      animations: true,
      timestamp: endDate.getTime(),
      minutes: {
        min: 0,
        max: 59,
        step: 1
      },
      hours: {
        min: 0,
        max: 11,
        step: 1
      }
    };


    this.SelectedStartTime = new MtrDatepicker(sconfig);
    this.SelectedEndTime = new MtrDatepicker(econfig);
  }

  public OnSaveDetails() {

    this.UserValidation = {};

    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (Validator.StringIsNullOrEmpty(this.User.LastName))
      this.UserValidation.LastName = true;


    if (Validator.StringIsNullOrEmpty(this.User.PhoneNumber))
      this.UserValidation.PhoneNumber = true;

    if (this.SelectedStartDay == -1 || !this.SelectedStartDay)
      this.UserValidation.SupplierStatrtWorkingDay = true;

    if (this.SelectedEndDay == -1 || !this.SelectedEndDay)
      this.UserValidation.SupplierEndWorkingDay = true;


    //debugger;
    if (!CoreHelper.CompareDates(this.SelectedStartTime, this.SelectedEndTime, true))
      this.UserValidation.WorkingHours = true;

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;

    this.User.StartWorkingTime = this.formatDate(this.SelectedStartTime.toUTCString(), 'hh:mm');
    this.User.EndWorkingTime = this.formatDate(this.SelectedEndTime.toUTCString(), 'hh:mm');

    this.User.SupplierStatrtWorkingDay = this.SelectedStartDay;
    this.User.SupplierEndWorkingDay = this.SelectedEndDay;


    this.IsLoading = true;
    this.userSVC.UpdateSupplierInfo(this.User).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
      this.IsLoading = false;
      Swal.fire({
        icon: 'success',
        text: this.resources.SavedSuccessfully,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((res: any) => {
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

    });



  }


  public OnDownload(type: AppEnums.DocumentType) {
    switch (type) {

    }
  }
}
