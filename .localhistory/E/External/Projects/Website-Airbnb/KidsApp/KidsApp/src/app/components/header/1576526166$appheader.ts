import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { AppEnums } from 'src/app/app.enums';
import { CoreSubjects } from 'src/app/core/core.subjects';
import { UsersService } from 'src/app/modules/users/users.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('LoginLink', { static: false }) LoginLink: ElementRef;

  public User: any = {
    Gender: AppEnums.Gender.Male
  };
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
    private userSVC: UsersService) {
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
    })
  }

  public ChangeLang() {
    if (environment.Lang == 'ar') {
      DataStore.addUpdate('Lang', 'en', CoreEnums.StorageLocation.LocalStorge);
    }
    else
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);

    location.reload();
  }

  public OpenLogin() {

  }

  public ngAfterViewInit() {

  }

  public OnForgotPassword() {
    $("#forgot_pw").fadeToggle("fast");
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

  }

  public OpenLoginPopup() {
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

  public OnLoginModalClose() {

    this.Credintials = {
      Email: '',
      Password: '',
      RememberMe: false,
      Validations: {}
    };

    $("#forgot_pw").hide();
    $("body").removeClass("signUpActive");

  }

  public OnSignUpButton() {
    $("body").addClass("signUpActive");
  }

  public OnBackToLogin() {
    $("body").removeClass("signUpActive");
  }
}
