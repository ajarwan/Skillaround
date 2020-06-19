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

    this.checkIfFBisLoggedIn();
  }

  public checkIfFBisLoggedIn() {

    FB.getLoginStatus((response) => {
      console.log(response)
      this.statusChangeCallback(response);
    });
  }

  public statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      this.checkLoginState();
    } else {                                 // Not logged into your webpage or we are unable to tell.

    }
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

        this.statusChangeCallback(res);

        //this.checkLoginState();
      } else {
        // The person is not logged into your webpage or we are unable to tell. 
      }
    }, { scope: 'public_profile,email,user_gender,user_birthday' });
  }

  public checkLoginState() {

    FB.api('/me', (response) => {
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
