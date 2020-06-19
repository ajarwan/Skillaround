import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SocialMedialService } from '../services/socialMedia.Service';
import { DataStore } from '../core/services/dataStrore.service';
import { CoreEnums } from '../core/core.enums';
declare var FB: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent extends BaseComponent {


  constructor(public smSVC: SocialMedialService) {
    super();
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
      } else {
        // The person is not logged into your webpage or we are unable to tell. 
      }
    }, { scope: 'public_profile,email' });
  }

  public checkLoginState() {

    FB.api('/me', (response) => {
      console.log(response);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });

  }

  //FB.logout(function(response) {
  //  // Person is now logged out
  //});
}
