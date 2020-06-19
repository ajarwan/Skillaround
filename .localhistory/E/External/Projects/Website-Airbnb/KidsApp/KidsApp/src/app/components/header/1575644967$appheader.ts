import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent implements AfterViewInit {


  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService,
    public smSVC: SocialMedialService) {
    super();
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

  ngAfterViewInit() {

    $('#access_link').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in'
    });
  }

  public OnForgotPassword() {
    $("#forgot_pw").fadeToggle("fast");
  }


  public LoginWithFB() {
    this.smSVC.fbLogin();
  }

  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  }

}
