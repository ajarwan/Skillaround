import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SocialMedialService } from '../services/socialMedia.Service';
import { DataStore } from '../core/services/dataStrore.service';
import { CoreEnums } from '../core/core.enums';
declare var google: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent extends BaseComponent implements OnInit {


  constructor(public smSVC: SocialMedialService) {
    super();
  }



  ngOnInit() {

  }

  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  }


  initPlacesAPI()
  {
    var service = new google.maps.places.PlacesService();

  }

  public LoginWithFB() {
    this.smSVC.fbLogin();
  }

  public LogOutFB() {
    this.smSVC.fbLogout();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);

  }



}
