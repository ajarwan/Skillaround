import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SocialMedialService } from '../services/socialMedia.Service';
import { DataStore } from '../core/services/dataStrore.service';
import { CoreEnums } from '../core/core.enums';
declare var FB: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent extends BaseComponent implements OnInit {


  constructor(public smSVC: SocialMedialService) {
    super();
  }



  ngOnInit() {

    setTimeout(() => {
      FB.getLoginStatus(function (response) {
        console.log(response)
      });
    }, 5000)

  }

  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  }

  test() {
    console.log(this.ActiveUser)
  }

  LoginWithFB() {
    FB.login((res) => {
      // handle the response
      console.log(res);
      if (res.status === 'connected') {
        // Logged into your webpage and Facebook.

        this.getUserInfo(res.authResponse.userID);

        //this.checkLoginState();
      } else {
        // The person is not logged into your webpage or we are unable to tell. 
      }
    }, { scope: 'public_profile,email' });
  }

  public getUserInfo(id) {

    FB.api(`/me?fields=id,name,email,gender,birthday,first_name,last_name,picture`, (response) => {
      console.log(response);
      console.log('Successful login for: ' + response.name);

    });

  }


  public LogOutFB() {
    FB.logout(function (response) {
      // Person is now logged out
    });
  }

}
