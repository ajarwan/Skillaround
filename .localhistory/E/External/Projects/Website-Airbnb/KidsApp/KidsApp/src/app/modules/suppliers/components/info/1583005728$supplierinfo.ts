import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { User } from 'src/app/shared/Classes/User';
import { AppEnums } from 'src/app/app.enums';
import { Localization } from 'src/app/core/services/localization';
import { Validator } from 'src/app/core/services/validator';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { SharedService } from 'src/app/shared/service/shared.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { debug } from 'util';
import { concat } from 'rxjs/operators';

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
  public NOL: any = null;

  public UserIncludes: any[] = ['WorkingDays']

  public WorkindDays: any[] = [
    { Id: AppEnums.Days.Sa, Title: Localization.Saturday },
    { Id: AppEnums.Days.Su, Title: Localization.Sunday },
    { Id: AppEnums.Days.Mo, Title: Localization.Monday },
    { Id: AppEnums.Days.Tu, Title: Localization.Tuesday },
    { Id: AppEnums.Days.We, Title: Localization.Wednesday },
    { Id: AppEnums.Days.Th, Title: Localization.Thursday },
    { Id: AppEnums.Days.Fr, Title: Localization.Friday },
  ]


  public SearchCountryField = SearchCountryField;
  public TooltipLabel = TooltipLabel;
  public CountryISO = CountryISO;

  public DaysSelections: any = [];

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private sharedSVC: SharedService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.PersonalInfo);

    this.LoadData()

  }

  public ngAfterViewInit() {




    $('.flag-container').click((e: any) => {
      $('#country-search-box').keydown((x: any) => {

        console.log($(x.target).closest('.intl-tel-input')[0].scrollTop);

        //debugger;
        //console.log(x);
        //x.target.scrollIntoView(!0);
        //x.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        //x.target.parentNode.scrollTop = x.target.offsetTop; 
        //$('.country-list')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      })
    })
  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {
    this.LoadUserDetails();
    this.LoadUserDocuments();
  }
  public LoadUserDetails() {
    this.userSVC.GetUserDetails(this.UserIncludes.join(',')).subscribe((res: any) => {
      if (!res)
        this.navigate('');

      this.User = res;

      this.AfterLoadUser();
    });
  }

  public AfterLoadUser() {

    if (this.User.DOB)
      this.User.DOB = SharedService.ResponeToDate(this.User.DOB);

    if (this.User.YearOfEstablishment)
      this.User.YearOfEstablishment = SharedService.ResponeToDate(this.User.YearOfEstablishment);

    if (this.User.LicenseExpiryDate)
      this.User.LicenseExpiryDate = SharedService.ResponeToDate(this.User.LicenseExpiryDate);

    if (!this.User.WorkingDays) {
      this.User.WorkingDays = [];
    }

    this.DaysSelections = [
      {
        Day: AppEnums.Days.Sa,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Sa && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Sa && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.Su,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Su && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Su && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.Mo,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Mo && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Mo && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.Tu,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Tu && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Tu && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.We,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.We && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.We && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.Th,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Th && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Th && !x.IsDeleted)[0]
      },
      {
        Day: AppEnums.Days.Fr,
        IsSelected: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Fr && !x.IsDeleted).length > 0,
        WorkingDay: this.User.WorkingDays.filter((x: any) => x.Day == AppEnums.Days.Fr && !x.IsDeleted)[0]
      },
    ];

  }

  public LoadUserDocuments() {
    this.userSVC.FindAllMyDocuments(true).subscribe((res: any) => {
      this.Documents = res;

      this.PersonalPhoto = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto)[0];
      this.TradeLicence = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.TradeLicence)[0];
      //Individual Documents
      this.GovermentId = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.GovermentId)[0];
      this.NOL = this.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.NOL)[0];




    })
  }

  public OnSaveDetails() {

    this.UserValidation = {};


    //Validate Common Fields
    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    this.ValidateWorkingDays();


    if (this.User.PhoneNumber && this.User.PhoneNumber.internationalNumber)
      this.User.PhoneNumber = this.User.PhoneNumber.internationalNumber;
    else
      this.User.PhoneNumber = '';

    if (Validator.StringIsNullOrEmpty(this.User.PhoneNumber))
      this.UserValidation.PhoneNumber = true;

    //Differences
    if (this.ActiveUser.UserType == AppEnums.UserTypes.IndividualSupplier) {
      if (Validator.StringIsNullOrEmpty(this.User.LastName))
        this.UserValidation.LastName = true;

      if (Validator.StringIsNullOrEmpty(this.User.IdNumber))
        this.UserValidation.IdNumber = true;

      if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB))
        this.UserValidation.Birthday = true;
    }
    else {

      if (!this.User.YearOfEstablishment || !Validator.IsValidDate(this.User.YearOfEstablishment))
        this.UserValidation.YearOfEstablishment = true;

      if (Validator.StringIsNullOrEmpty(this.User.LicenseNumber))
        this.UserValidation.LicenseNumber = true;

      if (!this.User.LicenseExpiryDate || !Validator.IsValidDate(this.User.LicenseExpiryDate))
        this.UserValidation.LicenseExpiryDate = true;

      if (Validator.StringIsNullOrEmpty(this.User.Location))
        this.UserValidation.Location = true;

    }

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


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
      });
      this.LoadData();
    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      })
    });



  }

  public async OnUploadFile(event: any, type: AppEnums.DocumentType) {

    if (event.target.files[0] && environment.AllowedImagesExtension.toLowerCase().indexOf((event.target.files[0].name.split('.').pop()).toLowerCase()) == -1) {
      return;
    }

    if (!this.User.Documents)
      this.User.Documents = [];

    this.sharedSVC.UploadFile({
      File: await this.ConvertToBase64(event.target.files[0]),
      Type: AppEnums.AttachmentLocationType.Users,
      Ext: CoreHelper.GetFileExtension(event.target.files[0].name)
    }).subscribe((res: any) => {

      switch (type) {
        case AppEnums.DocumentType.PersonalPhoto:

          this.PersonalPhoto.File = environment.MainEndPoint + res;
          this.PersonalPhoto.FileName = event.target.files[0].name;
          this.PersonalPhoto.FileSize = event.target.files[0].size;

          this.userSVC.UpdateUserDocument(this.PersonalPhoto).subscribe((res: any) => {

          });

          break;
        case AppEnums.DocumentType.GovermentId:

          this.GovermentId.File = environment.MainEndPoint + res;
          this.GovermentId.FileName = event.target.files[0].name;
          this.GovermentId.FileSize = event.target.files[0].size;


          this.userSVC.UpdateUserDocument(this.GovermentId).subscribe((res: any) => {

          });
          break;
        case AppEnums.DocumentType.TradeLicence:

          this.TradeLicence.File = environment.MainEndPoint + res;
          this.TradeLicence.FileName = event.target.files[0].name;
          this.TradeLicence.FileSize = event.target.files[0].size;


          this.userSVC.UpdateUserDocument(this.TradeLicence).subscribe((res: any) => {

          });
          break;
        case AppEnums.DocumentType.NOL:
          if (!this.NOL) {
            this.NOL = {
              DocumentType: AppEnums.DocumentType.NOL,
              UserId: this.ActiveUser.Id
            }
          }
          this.NOL.File = environment.MainEndPoint + res;
          this.NOL.FileName = event.target.files[0].name;
          this.NOL.FileSize = event.target.files[0].size;

          if (this.NOL.Id) {
            this.userSVC.UpdateUserDocument(this.NOL).subscribe((res: any) => {

            });
          }
          else {
            this.userSVC.AddUserDocument(this.NOL).subscribe((res: any) => {
              this.NOL = res;
            });
          }

          break;
      }

    });

  }

  public async OnUploadImage(event: any) {

    if (event.target.files[0] && environment.AllowedImagesExtension.toLowerCase().indexOf((event.target.files[0].name.split('.').pop()).toLowerCase()) == -1) {
      return;
    }

    this.User.Image = await this.ConvertToBase64(event.target.files[0]);

    this.userSVC.UpdateSupplierInfo(this.User, true).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
    });

  }


  public OnTest() {
    console.log(this.User.StartWorkingTime)
    console.log(this.User.EndWorkingTime)
    console.log(this.User)
    console.log(this.DaysSelections)
  }


  public OnDayClick(daysSelection: any) {

    daysSelection.IsSelected = !daysSelection.IsSelected;


    if (daysSelection.WorkingDay && daysSelection.WorkingDay.Id) {
      if (daysSelection.IsSelected) {
        daysSelection.WorkingDay.IsDeleted = false;
        daysSelection.WorkingDay.State = AppEnums.BaseState.Modified;
      }
      else {
        daysSelection.WorkingDay.IsDeleted = true;
        daysSelection.WorkingDay.State = AppEnums.BaseState.Deleted;
        //daysSelection.WorkingDay.Start = daysSelection.WorkingDay.End = null;
      }
    }
    else if (daysSelection.WorkingDay) {
      if (daysSelection.IsSelected) {
        daysSelection.WorkingDay = {
          UserId: this.User.Id,
          Day: daysSelection.Day,
          State: AppEnums.BaseState.Added
        };
      }
      else {
        daysSelection.WorkingDay = null;
      }
    }
    else {

      if (daysSelection.IsSelected) {
        daysSelection.WorkingDay = {
          UserId: this.User.Id,
          Day: daysSelection.Day,
          State: AppEnums.BaseState.Added
        };
      }
      else {
        daysSelection.WorkingDay = null;
      }

    }

  }

  public ValidateWorkingDays() {

    this.User.WorkingDays = [];
    this.DaysSelections.forEach((x: any) => {
      x.StartError = false;
      x.EndError = false;
      x.RangeError = false;

      if (x.WorkingDay)
        this.User.WorkingDays.push(x.WorkingDay);


      if (x.IsSelected) {
        if (x.WorkingDay) {
          if (!x.WorkingDay.Start)
            x.StartError = true;
          if (!x.WorkingDay.End)
            x.EndError = true;

          if (!x.StartError && !x.EndError) {
            //debugger;
            let StartDate = CoreHelper.TimeToDate2(x.WorkingDay.Start);
            let EndDate = CoreHelper.TimeToDate2(x.WorkingDay.End);
            if (!CoreHelper.CompareDates(StartDate, EndDate, true))
              x.RangeError = true;
          }

          if (x.StartError || x.EndError || x.RangeError)
            this.UserValidation.WorkingDays = true;
        }

      }

    })

    //if (this.SelectedStartDay == -1 || !this.SelectedStartDay)
    //  this.UserValidation.SupplierStatrtWorkingDay = true;

    //if (this.SelectedEndDay == -1 || !this.SelectedEndDay)
    //  this.UserValidation.SupplierEndWorkingDay = true;

    //if (!this.SelectedStartTime || !this.SelectedEndTime) {

    //  if (!this.SelectedStartTime)
    //    this.UserValidation.SelectedStartTime = true;

    //  if (!this.SelectedEndTime)
    //    this.UserValidation.SelectedEndTime = true;
    //}
    //else {
    //  StartDate = CoreHelper.TimeToDate(this.SelectedStartTime);
    //  EndDate = CoreHelper.TimeToDate(this.SelectedEndTime);

    //  if (!CoreHelper.CompareDates(StartDate, EndDate, true))
    //    this.UserValidation.WorkingHours = true;
    //}

    //if (!CoreHelper.CompareDates(this.SelectedStartTime, this.SelectedEndTime, true))
    //  this.UserValidation.WorkingHours = true;
  }

}
