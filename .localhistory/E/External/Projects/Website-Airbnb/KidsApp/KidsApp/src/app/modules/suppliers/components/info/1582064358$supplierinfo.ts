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

  public SearchCountryField = SearchCountryField;
  public TooltipLabel = TooltipLabel;
  public CountryISO = CountryISO;

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
    this.LoadUserDetails();
    this.LoadUserDocuments();



  }

  public ngAfterViewInit() {




    $('.flag-container').click((e: any) => {
      $('#country-search-box').keydown((x: any) => {
        console.log(e);
        e.target.scrollIntoView(!0);
      })
    })
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
      if (this.User.StartWorkingTime) {
        this.SelectedStartTime = CoreHelper.StringToTime(this.User.StartWorkingTime);
      }
      if (this.User.EndWorkingTime) {
        this.SelectedEndTime = CoreHelper.StringToTime(this.User.EndWorkingTime);
      }
      //this.SelectedStartTime = new Date();
      //this.SelectedEndTime = new Date();

      //this.InitTimePickers();

      if (this.User.DOB)
        this.User.DOB = SharedService.ResponeToDate(this.User.DOB);

      if (this.User.YearOfEstablishment)
        this.User.YearOfEstablishment = SharedService.ResponeToDate(this.User.YearOfEstablishment);

      if (this.User.LicenseIssueDate)
        this.User.LicenseIssueDate = SharedService.ResponeToDate(this.User.LicenseIssueDate);




    });
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

    let StartDate = null;
    let EndDate = null;

    //Validate Common Fields
    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (this.SelectedStartDay == -1 || !this.SelectedStartDay)
      this.UserValidation.SupplierStatrtWorkingDay = true;

    if (this.SelectedEndDay == -1 || !this.SelectedEndDay)
      this.UserValidation.SupplierEndWorkingDay = true;

    if (!this.SelectedStartTime || !this.SelectedEndTime) {

      if (!this.SelectedStartTime)
        this.UserValidation.SelectedStartTime = true;

      if (!this.SelectedEndTime)
        this.UserValidation.SelectedEndTime = true;
    }
    else {
      StartDate = CoreHelper.TimeToDate(this.SelectedStartTime);
      EndDate = CoreHelper.TimeToDate(this.SelectedEndTime);

      if (!CoreHelper.CompareDates(StartDate, EndDate, true))
        this.UserValidation.WorkingHours = true;
    }

    if (!CoreHelper.CompareDates(this.SelectedStartTime, this.SelectedEndTime, true))
      this.UserValidation.WorkingHours = true;

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

      if (!this.User.LicenseIssueDate || !Validator.IsValidDate(this.User.LicenseIssueDate))
        this.UserValidation.LicenseIssueDate = true;

      if (Validator.StringIsNullOrEmpty(this.User.Location))
        this.UserValidation.Location = true;

    }



    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;

    this.User.StartWorkingTime = this.formatDate(StartDate, 'hh:mm');
    this.User.EndWorkingTime = this.formatDate(EndDate, 'hh:mm');

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
      });

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

}
