import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { AppEnums } from 'src/app/app.enums';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('LoginLink', { static: false }) LoginLink: ElementRef
  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService,
    public smSVC: SocialMedialService) {
    super();
  }

  public ngOnInit() {
    SharedSubjects.onLogin.subscribe((res: any) => {
      $.magnificPopup.close()

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

    $(this.LoginLink.nativeElement).magnificPopup({
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
      mainClass: 'my-mfp-zoom-in'
    }
    );
    //$('#access_link').magnificPopup({
    //  items: {
    //    src: '#sign-in-dialog'
    //  },
    //  type: 'inline',
    //  fixedContentPos: true,
    //  fixedBgPos: true,
    //  overflowY: 'auto',
    //  closeBtnInside: true,
    //  preloader: false,
    //  midClick: true,
    //  removalDelay: 300,
    //  mainClass: 'my-mfp-zoom-in'
    //});
  }

  public OnForgotPassword() {
    $("#forgot_pw").fadeToggle("fast");
  }

  public LoginWithFB() {
    this.smSVC.fbLogin();
    $.magnificPopup.close()
  }

  public SignUpGoogle() {
    if (!DataStore.get('GoogleInitialized')) {
      this.smSVC.gInitialize();
      setTimeout(() => {
        (<HTMLElement>document.getElementById('gSignIn').firstChild).click();

      }, 1000)
    }
    else {
      (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
    }

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

    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);

  }

  public OpenLoginPopup() {
  }
}
