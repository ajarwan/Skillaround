import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { AppEnums } from 'src/app/app.enums';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { UsersService } from 'src/app/modules/users/users.service';
import { Validator } from 'src/app/core/services/validator';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var $: any;

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { Localization } from 'src/app/core/services/localization';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';


enum LoginTabs {
  Login = 1,
  SignUp = 2,
  ForgetPassword = 3
}


enum BecomeSupplierTabs {
  Login = 1,
  Details = 2
}

enum Files {
  PersonalPhoto = 1,
  PersonalId = 2,
  TradeLicence = 3
}



@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('LoginLink', { static: false }) LoginLink: ElementRef;

  public SearchCountryField = SearchCountryField;
  public TooltipLabel = TooltipLabel;
  public CountryISO = CountryISO;

  public WorkindDays: any[] = SharedService.Lookups.WorkindDays;

  public BecomeSupplierTabs = BecomeSupplierTabs;
  public SupplierActiveTab: BecomeSupplierTabs = BecomeSupplierTabs.Login;
  public SelectedStartDay = -1;
  public SelectedEndDay = -1;
  public SelectedStartTime: any;
  public SelectedEndTime: any;
  public Files = Files;



  public LoginTabs = LoginTabs;
  public ActiveTab: LoginTabs = LoginTabs.Login;
  public UserForgetEmail: string = '';
  public InvalidForgetEmail: boolean = false;
  public NoUserAssociated: boolean = false;
  public IsForgetPasswordLoading: boolean = false;

  public User: any = {};
  public UserValidation: any = {};
  public Credintials: any = {
    Email: '',
    Password: '',
    RememberMe: false,
    Validations: {}
  };





  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService,
    public smSVC: SocialMedialService,
    private userSVC: UsersService,
    public ngZone: NgZone,
    public cd: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {



    CoreSubjects.onLoginSubject.subscribe((res: any) => {
      $.magnificPopup.close();
      this.Credintials = {
        Email: '',
        Password: '',
        RememberMe: false,
        Validations: {}
      };

      this.ngZone.run(() => {
        this.cd.detectChanges();
      })

      if (res.isNewUser) {
        this.ShowWelcomeMsg();
      }
    })

  }

  public ngAfterViewInit() {

  }

  public ChangeLang() {
    if (environment.Lang == 'ar') {
      DataStore.addUpdate('Lang', 'en', CoreEnums.StorageLocation.LocalStorge);
    }
    else
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);

    location.reload();
  }

  public LoginWithFB() {
    this.smSVC.fbLogin();
  }

  public SignUpGoogle() {

    DataStore.addUpdate('SignUpGoogleClick', true);
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();

    //if (!DataStore.get('GoogleInitialized')) {
    //  this.smSVC.gInitialize();
    //  setTimeout(() => {
    //    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();

    //  }, 1000)
    //}
    //else {
    //  (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
    //}

  }

  public SignOut() {
    if (this.ActiveUser.LoginProvider == AppEnums.LoginProvider.Google) {
      if (!DataStore.get('GoogleInitialized')) {
        this.smSVC.gInitialize();
        setTimeout(() => {
          this.smSVC.gSignOut();
        }, 250)
      }
      else {
        this.smSVC.gSignOut();

      }
    }
    else if (this.ActiveUser.LoginProvider == AppEnums.LoginProvider.Facebook) {
      this.smSVC.fbLogout();
    }

    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
    DataStore.addUpdate('token', null, CoreEnums.StorageLocation.LocalStorge);
    this.navigate('');
  }

  public SystemLogin() {
    this.Credintials.Validations = {};
    if (!this.Credintials.Email) {
      this.Credintials.Validations.Email = true;
    }
    if (!this.Credintials.Password) {
      this.Credintials.Validations.Password = true;
    }

    if (this.Credintials.Validations.Password || this.Credintials.Validations.Email)
      return;

    this.userSVC.Login(this.Credintials.Email, this.Credintials.Password).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res.user, CoreEnums.StorageLocation.LocalStorge);
      DataStore.addUpdate('token', res.token, CoreEnums.StorageLocation.LocalStorge);
      CoreSubjects.onLoginSubject.next(res);
    }, (err: any) => {
      this.Credintials.Validations.Invalid = true;
    })
  }

  public OnSignUpSystem() {

    if (this.UserValidation.AccountExisit)
      return;

    this.UserValidation = {};

    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (Validator.StringIsNullOrEmpty(this.User.LastName))
      this.UserValidation.LastName = true;

    if (Validator.StringIsNullOrEmpty(this.User.Email))
      this.UserValidation.Email = true;

    if (!Validator.IsValidEmail(this.User.Email))
      this.UserValidation.Email = true;

    if (Validator.StringIsNullOrEmpty(this.User.PasswordHash))
      this.UserValidation.PasswordHash = true;

    if (Validator.StringIsNullOrEmpty(this.User.PasswordHash2))
      this.UserValidation.PasswordHash2 = true;

    if (!Validator.StringIsNullOrEmpty(this.User.PasswordHash)
      && !Validator.StringIsNullOrEmpty(this.User.PasswordHash2)
      && (this.User.PasswordHash != this.User.PasswordHash2)) {
      this.UserValidation.PasswordMisMatch = true;
    }


    if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB)) {
      this.UserValidation.Birthday = true;
    }

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    if (this.User.PasswordHash.length < 8)
      this.UserValidation.PasswordLength = true;


    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;



    this.userSVC.SignupSM(this.User, true);
  }

  public OnEmailTyping() {
    if (this.ActiveUser)
      return;

    this.UserValidation.ExistedEmail = false;

    if (!this.User.Email || !Validator.IsValidEmail(this.User.Email))
      return;

    this.userSVC.CheckEmail(this.User.Email).subscribe((res: any) => {
      if (res)
        this.UserValidation.AccountExisit = false;
      else {
        this.UserValidation.AccountExisit = true;
      }

    })
  }

  public ResetPassword() {
    this.NoUserAssociated = false;
    this.InvalidForgetEmail = false;

    if (Validator.StringIsNullOrEmpty(this.UserForgetEmail) || !Validator.IsValidEmail(this.UserForgetEmail)) {
      this.InvalidForgetEmail = true;
      return;
    }

    this.IsForgetPasswordLoading = true;
    this.userSVC.ForgetPassword(this.UserForgetEmail).subscribe((res: any) => {
      this.IsForgetPasswordLoading = false;
      if (!res) {
        this.NoUserAssociated = true;
      }
      else {
        $.magnificPopup.close();

        Swal.fire({
          icon: 'success',
          text: this.resources.LinkToResetPassword + this.UserForgetEmail,
          //timer: 2500,
          showConfirmButton: true,
          confirmButtonText: this.resources.Close
        });

        this.UserForgetEmail = '';
      }
    });
  }

  public InitUserModal() {

    this.User = {
      Gender: AppEnums.Gender.Male,
      LoginProvider: AppEnums.LoginProvider.System
    };

  }
  /********************************** 
   * Login Modal Methods
   **********************************/

  public OpenLoginModal() {
    this.ActiveTab = LoginTabs.Login;
    this.UserValidation = {};
    this.InitUserModal();

    let me = this;
    $.magnificPopup.open({
      items: {
        src: '#sign-in-dialog'
      },
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      callbacks: {
        close: function () {
          me.OnLoginModalClose()
        }
      }
    });
  }

  public OnLoginModalClose() {

    this.Credintials = {
      Email: '',
      Password: '',
      RememberMe: false,
      Validations: {}
    };

    //$("#forgot_pw").hide();
    //$("body").removeClass("signUpActive");

  }

  public SetActiveTab(tab: LoginTabs) {
    this.ActiveTab = tab;

  }

  /** ******************************** 
   * Supplier Modal MEthods
   * *********************************/

  public OpenBecomeSupplier() {
    this.UserValidation = {};
    this.InitUserModal();
    this.SupplierActiveTab = BecomeSupplierTabs.Login;

    if (this.ActiveUser) {
      this.User = this.clone(this.ActiveUser);

    }



    let me = this;
    $.magnificPopup.open({
      items: {
        src: '#become-supplier-dialog'
      },
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      callbacks: {
        close: function () {
          me.OnBecomeSupplierModalClose()
        }
      }
    });
  }

  public OnBecomeSupplierModalClose() {

  }

  public SetSupplierActiveTab(tab: BecomeSupplierTabs) {
    // Validate First Tab
    if (this.UserValidation.AccountExisit)
      return;

    this.UserValidation = {};


    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (Validator.StringIsNullOrEmpty(this.User.LastName))
      this.UserValidation.LastName = true;

    if (Validator.StringIsNullOrEmpty(this.User.Email))
      this.UserValidation.Email = true;

    if (!Validator.IsValidEmail(this.User.Email))
      this.UserValidation.Email = true;

    if (!this.ActiveUser) {
      if (Validator.StringIsNullOrEmpty(this.User.PasswordHash))
        this.UserValidation.PasswordHash = true;

      if (Validator.StringIsNullOrEmpty(this.User.PasswordHash2))
        this.UserValidation.PasswordHash2 = true;

      if (!Validator.StringIsNullOrEmpty(this.User.PasswordHash)
        && !Validator.StringIsNullOrEmpty(this.User.PasswordHash2)
        && (this.User.PasswordHash != this.User.PasswordHash2)) {
        this.UserValidation.PasswordMisMatch = true;
      }
    }


    if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB)) {
      this.UserValidation.Birthday = true;
    }

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;

    if (!this.ActiveUser) {
      if (this.User.PasswordHash.length < 8)
        this.UserValidation.PasswordLength = true;
    }



    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    this.SupplierActiveTab = tab;

  }

  public OnBecomeSupplierRegister() {

    console.log(this.SelectedStartTime)
    console.log(CoreHelper.TimeToDate(this.SelectedStartTime));
    console.log(CoreHelper.StringToTime('13:50');
    return;

    //console.log(this.User);


    this.UserValidation = {};

    this.User.PhoneNumber = this.User.PhoneNumber.internationalNumber;
    if (Validator.StringIsNullOrEmpty(this.User.PhoneNumber))
      this.UserValidation.PhoneNumber = true;

    if (this.SelectedStartDay == -1)
      this.UserValidation.SupplierStatrtWorkingDay = true;

    if (this.SelectedEndDay == -1)
      this.UserValidation.SupplierEndWorkingDay = true;


    let timeStart = new Date();
    let timeEnd = new Date();

    //timeStart.setHours(this.SelectedStartHour);
    //timeStart.setMinutes(this.SelectedStartMin);

    //timeEnd.setHours(this.SelectedEndHour);
    //timeEnd.setMinutes(this.SelectedEndMin);

    if (!CoreHelper.CompareDates(this.SelectedStartTime, this.SelectedEndTime, true))
      this.UserValidation.WorkingHours = true;

    if (!this.User.Documents) {
      this.UserValidation.PersonalPhoto = true;
      this.UserValidation.GovermentId = true;
      this.UserValidation.TradeLicence = true;
    }
    else {

      if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto).length == 0)
        this.UserValidation.PersonalPhoto = true;
      if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.GovermentId).length == 0)
        this.UserValidation.GovermentId = true;
      if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.TradeLicence).length == 0)
        this.UserValidation.TradeLicence = true;
    }


    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    if (this.User.DOB || Validator.IsValidDate(this.User.DOB)) {
      this.UserValidation.Birthday = true;
    }

    // this.User.DOB = new Date(<number>this.SelectedYear, this.SelectedMonth, this.SelectedDay);

    this.User.IsSupplier = true;

    //this.User.StartWorkingTime = this.SelectedStartTime.getFullTime();
    //this.User.EndWorkingTime = this.SelectedEndTime.getFullTime();

    this.User.StartWorkingTime = this.formatDate(this.SelectedStartTime.toUTCString(), 'hh:mm');
    this.User.EndWorkingTime = this.formatDate(this.SelectedEndTime.toUTCString(), 'hh:mm');

    this.User.SupplierStatrtWorkingDay = this.SelectedStartDay;
    this.User.SupplierEndWorkingDay = this.SelectedEndDay;

    let Id = this.User.Id;
    this.userSVC.RegisterSupplier(this.User).subscribe((res: any) => {
      console.log(res);
      localStorage.removeItem('ActiveUser');
      localStorage.removeItem('token');

      DataStore.addUpdate('ActiveUser', res.user, CoreEnums.StorageLocation.LocalStorge);
      DataStore.addUpdate('token', res.token, CoreEnums.StorageLocation.LocalStorge);
      CoreSubjects.onLoginSubject.next(res);
    });
  }

  public async OnUploadFile(event: any, type: Files) {

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
        case Files.PersonalPhoto:

          let photo = this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto)[0];

          if (event.target.files.length == 0 || !event.target.files[0]) {
            this.User.Documents = this.User.Documents.filter((x: any) => x.DocumentType != AppEnums.DocumentType.PersonalPhoto);
          }
          else {

            if (photo) {
              photo.File = environment.MainEndPoint + res;
              photo.FileName = event.target.files[0].name;
              photo.FileSize = event.target.files[0].size;
            }
            else {
              this.User.Documents.push({
                File: environment.MainEndPoint + res,
                DocumentType: AppEnums.DocumentType.PersonalPhoto,
                FileName: event.target.files[0].name,
                FileSize: event.target.files[0].size
              });
            }
          }
          break;
        case Files.PersonalId:
          let GovermentId = this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.GovermentId)[0];

          if (event.target.files.length == 0 || !event.target.files[0]) {
            this.User.Documents = this.User.Documents.filter((x: any) => x.DocumentType != AppEnums.DocumentType.GovermentId);
          }
          else {

            if (GovermentId) {
              GovermentId.File = environment.MainEndPoint + res;
              GovermentId.FileName = event.target.files[0].name;
              GovermentId.FileSize = event.target.files[0].size;
            }
            else {
              this.User.Documents.push({
                File: environment.MainEndPoint + res,
                DocumentType: AppEnums.DocumentType.GovermentId,
                FileName: event.target.files[0].name,
                FileSize: event.target.files[0].size
              });
            }
          }
          break;
        case Files.TradeLicence:
          let TradeLicence = this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.TradeLicence)[0];

          if (event.target.files.length == 0 || !event.target.files[0]) {
            this.User.Documents = this.User.Documents.filter((x: any) => x.DocumentType != AppEnums.DocumentType.TradeLicence);
          }
          else {

            if (TradeLicence) {
              TradeLicence.File = environment.MainEndPoint + res;
              TradeLicence.FileName = event.target.files[0].name;
              TradeLicence.FileSize = event.target.files[0].size;
            }
            else {
              this.User.Documents.push({
                File: environment.MainEndPoint + res,
                DocumentType: AppEnums.DocumentType.TradeLicence,
                FileName: event.target.files[0].name,
                FileSize: event.target.files[0].size
              });
            }
          }
          break;
      }


      //this.Activity.Documents.push({
      //  File: environment.MainEndPoint + res,
      //  IsMain: isMain,
      //  Guid: CoreHelper.NewGuid()
      //});

    })



  }


  public ShowWelcomeMsg() {
    Swal.fire({
      icon: 'success',
      text: this.resources.SignUpSuccessfullMsg,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    });

  }


}






