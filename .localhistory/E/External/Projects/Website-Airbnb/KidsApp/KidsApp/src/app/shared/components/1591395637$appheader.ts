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
import { CoreHelper } from 'src/app/core/services/core.helper';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

import Swal from 'sweetalert2';
import { SharedSubjects } from '../service/shared.subjects';
declare var $: any;

enum LoginTabs {
  Login = 1,
  SignUp = 2,
  ForgetPassword = 3
}

enum BecomeSupplierTabs {
  WelcomeMessage = 1,
  Question = 2,
  Login = 3,
  Details = 4,
  Submit = 5
}

enum Files {
  PersonalPhoto = 1,
  PersonalId = 2,
  TradeLicence = 3,
  NOL = 5,
  Certificate = 6
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
  public PreferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

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


  public IsTermAndConditionsAccepted = false;

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

      this.userSVC.KeepAlive();
      this.userSVC.LoadNotificationCount();
    })

    SharedSubjects.OpenLoginPopup.subscribe((res: any) => {
      this.OpenLoginModal();
    })


    setTimeout(() => {
      if (!DataStore.get('IgnorLogin') && !this.ActiveUser) {
        this.OpenLoginModal();
      }
    }, 3000)


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

    this.CloseWindow();

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
      //this.smSVC.fbLogout();
    }

    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
    DataStore.addUpdate('token', null, CoreEnums.StorageLocation.LocalStorge);
    this.navigate('');
    //delayed to not navigate back to the same page after refresh
    setTimeout(() => {
      location.reload();
    }, 500)

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

    console.log(this.User);

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


    //if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB)) {
    //  this.UserValidation.Birthday = true;
    //}

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    if (this.User.PasswordHash.length < 8)
      this.UserValidation.PasswordLength = true;


    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    if (this.User.PhoneNumber && this.User.PhoneNumber.internationalNumber)
      this.User.PhoneNumber = this.User.PhoneNumber.internationalNumber;

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

  public GoToMyProfile() {
    this.CloseWindow();
    if (this.ActiveUser && (this.ActiveUser.UserType == AppEnums.UserTypes.CompanySupplier || this.ActiveUser.UserType == AppEnums.UserTypes.IndividualSupplier))
      this.navigate('supplier/info');
    else
      this.navigate('user/myprofile');
  }
  /********************************** 
   * Login Modal Methods
   **********************************/

  public OpenLoginModal() {
    this.CloseWindow()
    this.SupplierActiveTab = BecomeSupplierTabs.Login;
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

    DataStore.addUpdate('IgnorLogin', true, CoreEnums.StorageLocation.LocalStorge);

  }

  public SetActiveTab(tab: LoginTabs) {
    this.ActiveTab = tab;

  }

  /** ******************************** 
   * Supplier Modal MEthods
   * *********************************/

  public OpenBecomeSupplier() {
    this.CloseWindow();
    this.UserValidation = {};
    this.InitUserModal();
    this.SupplierActiveTab = BecomeSupplierTabs.WelcomeMessage;
    this.ActiveTab = LoginTabs.Login;

    if (this.ActiveUser) {
      this.User = this.clone(this.ActiveUser);

    }

    this.User.UserType = AppEnums.UserTypes.CompanySupplier;


    let me = this;
    $.magnificPopup.open({
      items: {
        src: '#become-supplier-dialog'
      },
      closeOnBgClick: false,
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

  public SetSupplierActiveTab(tab: BecomeSupplierTabs, fromMeter = false) {

    //debugger;
    let navigate = true;
    //this.UserValidation = {};
    switch (tab) {

      case BecomeSupplierTabs.Details:
        if (this.UserValidation.AccountExisit) {
          navigate = false;
          return;

        }
        this.UserValidation = {};
        if (this.User.UserType == AppEnums.UserTypes.IndividualSupplier) {
          if (Validator.StringIsNullOrEmpty(this.User.FirstName))
            this.UserValidation.FirstName = true;

          if (Validator.StringIsNullOrEmpty(this.User.LastName))
            this.UserValidation.LastName = true;

          if (Validator.StringIsNullOrEmpty(this.User.IdNumber))
            this.UserValidation.IdNumber = true;

          if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB)) {
            this.UserValidation.Birthday = true;
          }

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

          if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
            navigate = false;

          if (navigate) {
            if (!this.ActiveUser) {
              if (this.User.PasswordHash.length < 8) {
                this.UserValidation.PasswordLength = true;
                navigate = false;
              }
            }
          }
        }
        else {
          if (Validator.StringIsNullOrEmpty(this.User.FirstName))
            this.UserValidation.FirstName = true;

          if (!this.User.YearOfEstablishment || !Validator.IsValidDate(this.User.YearOfEstablishment)) {
            this.UserValidation.YearOfEstablishment = true;
          }

          if (Validator.StringIsNullOrEmpty(this.User.LicenseNumber))
            this.UserValidation.LicenseNumber = true;

          if (!this.User.LicenseExpiryDate || !Validator.IsValidDate(this.User.LicenseExpiryDate)) {
            this.UserValidation.LicenseExpiryDate = true;
          }

          if (Validator.StringIsNullOrEmpty(this.User.Location))
            this.UserValidation.Location = true;


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

          if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
            navigate = false;

          if (navigate) {
            if (!this.ActiveUser) {
              if (this.User.PasswordHash.length < 8) {
                this.UserValidation.PasswordLength = true;
                navigate = false;
              }

            }
          }

        }

        break;
      case BecomeSupplierTabs.Submit:

        this.UserValidation = {};

        if (this.User.PhoneNumber && this.User.PhoneNumber.internationalNumber)
          this.User.PhoneNumber = this.User.PhoneNumber.internationalNumber;
        else
          this.User.PhoneNumber = '';

        if (Validator.StringIsNullOrEmpty(this.User.PhoneNumber))
          this.UserValidation.PhoneNumber = true;

        if (this.SelectedStartDay == -1)
          this.UserValidation.SupplierStatrtWorkingDay = true;

        if (this.SelectedEndDay == -1)
          this.UserValidation.SupplierEndWorkingDay = true;

        if (this.SelectedStartDay != -1 && this.SelectedEndDay != -1) {
          if (this.SelectedStartDay > this.SelectedEndDay)
            this.UserValidation.SupplierStartEndWorkingDays = true;
        }

        let StartDate = null;
        let EndDate = null;

        if (!this.SelectedStartTime || !this.SelectedEndTime) {

          if (!this.SelectedStartTime)
            this.UserValidation.SelectedStartTime = true;

          if (!this.SelectedEndTime)
            this.UserValidation.SelectedEndTime = true;
        }
        else {
          StartDate = CoreHelper.TimeToDate2(this.SelectedStartTime);
          EndDate = CoreHelper.TimeToDate2(this.SelectedEndTime);

          if (!CoreHelper.CompareDates(StartDate, EndDate, true))
            this.UserValidation.WorkingHours = true;
        }


        if (!this.User.Documents) {
          this.UserValidation.PersonalPhoto = true;
          this.UserValidation.GovermentId = true;
          this.UserValidation.TradeLicence = true;
          this.UserValidation.NOL = true;
        }
        else {

          if (this.User.UserType == AppEnums.UserTypes.IndividualSupplier) {
            if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto).length == 0)
              this.UserValidation.PersonalPhoto = true;
            if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.GovermentId).length == 0)
              this.UserValidation.GovermentId = true;
            //if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.NOL).length == 0)
            //  this.UserValidation.NOL = true;
          }
          else {
            if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.PersonalPhoto).length == 0)
              this.UserValidation.PersonalPhoto = true;
            if (this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.TradeLicence).length == 0)
              this.UserValidation.TradeLicence = true;
          }
        }


        if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
          navigate = false;

        break;


    }

    if (navigate)
      this.SupplierActiveTab = tab;

  }

  public OnBecomeSupplierRegister() {

    this.UserValidation = {};

    if (!this.IsTermAndConditionsAccepted)
      this.UserValidation.TAC = true;
    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    //Set Working Days
    let start = parseInt(this.SelectedStartDay.toString());
    let end = parseInt(this.SelectedEndDay.toString());
    this.User.WorkingDays = [];
    while (start <= end) {
      this.User.WorkingDays.push({
        State: AppEnums.BaseState.Added,
        Day: start,
        Start: this.SelectedStartTime,
        End: this.SelectedEndTime
      });
      start += 1;
    }




    this.User.IsSupplier = true;

    //this.User.UserType = AppEnums.UserTypes.IndividualSupplier;
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
        case Files.NOL:
          let NOL = this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.NOL)[0];

          if (event.target.files.length == 0 || !event.target.files[0]) {
            this.User.Documents = this.User.Documents.filter((x: any) => x.DocumentType != AppEnums.DocumentType.NOL);
          }
          else {

            if (NOL) {
              NOL.File = environment.MainEndPoint + res;
              NOL.FileName = event.target.files[0].name;
              NOL.FileSize = event.target.files[0].size;
            }
            else {
              this.User.Documents.push({
                File: environment.MainEndPoint + res,
                DocumentType: AppEnums.DocumentType.NOL,
                FileName: event.target.files[0].name,
                FileSize: event.target.files[0].size
              });
            }
          }
          break;
        case Files.Certificate:
          let Certificate = this.User.Documents.filter((x: any) => x.DocumentType == AppEnums.DocumentType.Certificate)[0];

          if (event.target.files.length == 0 || !event.target.files[0]) {
            this.User.Documents = this.User.Documents.filter((x: any) => x.DocumentType != AppEnums.DocumentType.Certificate);
          }
          else {

            if (Certificate) {
              Certificate.File = environment.MainEndPoint + res;
              Certificate.FileName = event.target.files[0].name;
              Certificate.FileSize = event.target.files[0].size;
            }
            else {
              this.User.Documents.push({
                File: environment.MainEndPoint + res,
                DocumentType: AppEnums.DocumentType.Certificate,
                FileName: event.target.files[0].name,
                FileSize: event.target.files[0].size
              });
            }
          }
          break;
      }

      $('.file-upload-clear').val();
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
      confirmButtonText: this.resources.Ok
    });

  }


  public OnTest() {
    console.log(this.User);
  }


  public CloseWindow() {
    $('#navbar-main').removeClass('show');
  }
}






