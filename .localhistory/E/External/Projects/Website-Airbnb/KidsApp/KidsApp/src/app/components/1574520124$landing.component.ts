import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SocialMedialService } from '../services/socialMedia.Service';
import { DataStore } from '../core/services/dataStrore.service';
import { CoreEnums } from '../core/core.enums';
import { window } from 'rxjs-compat/operator/window';
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

    window['checkLoginState'] = 1;

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
        this.checkLoginState();
        //this.getUserInfo(res.authResponse.userID);

        //this.checkLoginState();
      } else {
        // The person is not logged into your webpage or we are unable to tell. 
      }
    }, { scope: 'public_profile,email' });
  }

  
  public checkLoginState() {
    FB.getLoginStatus((response) => {
      //Called After Login
      console.log(response);
      this.statusChangeCallback(response);
    });
  }

  public statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      //this.getUserInfo();
    } else {                                 // Not logged into your webpage or we are unable to tell.
     
    }
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
