import { Injectable } from '@angular/core';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { DataStore } from '../core/services/dataStrore.service';
import { Observable } from 'rxjs';
import { HttpInterceptor, UrlConfig } from '../core/services/http.interceptor';
import { AppEnums } from '../app.enums';
import { debug } from 'util';
import { UsersService } from '../modules/users/users.service';
import { CoreEnums } from '../core/core.enums';
import { SharedSubjects } from '../shared/service/shared.subjects';
import { CoreSubjects } from '../core/core.subjects';
import { SharedService } from '../shared/service/shared.service';
declare var gapi: any;
declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class SocialMedialService {


  get resources() {
    return DataStore.resources;
  }

  constructor(private userSVC: UsersService) {
  }

  public gInitialize() {

    // debugger
    //if (gapi.auth2.getAuthInstance()) {
    //  debugger;
    //  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    //    debugger;
    //    return;
    //  }
    //  else {

    //  }
    //}
    //else {


    //}


    //if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    //  var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    //  console.log('ID: ' + profile.getId());
    //  console.log('Full Name: ' + profile.getName());
    //  console.log('Given Name: ' + profile.getGivenName());
    //  console.log('Family Name: ' + profile.getFamilyName());
    //  console.log('Image URL: ' + profile.getImageUrl());
    //  console.log('Email: ' + profile.getEmail());
    //}

    var x = gapi.signin2.render('gSignIn', {
      'scope': 'profile email',
      'width': 0,
      'height': 0,
      'longtitle': false,
      'theme': 'dark',
      'onsuccess': (res) => {
        this.gLoginSuccess(res);
      },
      'onfailure': () => {
        console.log('login with google faild')
      }
    });

    DataStore.addUpdate('GoogleInitialized', true);

  }

  public gLoginSuccess(res) {

    if (!DataStore.get('SignUpGoogleClick')
      return;

    //console.log(res);
    //console.log('on Gmail LoginSuccess');
    //var profile = res.getBasicProfile();
    //console.log(res.getAuthResponse().id_token);

    gapi.client.load('oauth2', 'v2', () => {
      var request = gapi.client.oauth2.userinfo.get({
        'userId': 'me'
      });
      request.execute((res) => {
        console.log(res)

        //User Already Logged In
        if (DataStore.get('ActiveUser')) {
          CoreSubjects.onLoginSubject.next(DataStore.get('ActiveUser'));

          return;
        }
        let user = {
          Email: res.email,
          Image: res.picture,
          FirstName: res.given_name,
          LastName: res.family_name,
          LoginProvider: AppEnums.LoginProvider.Google,
          ProviderId: res.id
        }
        this.userSVC.Signup(user, true).subscribe((innerRes: any) => {
          //debugger;
          console.log(innerRes);
          DataStore.addUpdate('ActiveUser', innerRes, CoreEnums.StorageLocation.LocalStorge);
          CoreSubjects.onLoginSubject.next(innerRes);
        }, (error: any) => {
          CoreSubjects.onLoginSubject.next({ error: error });
          SharedService.ShowNotificationDialog(this.resources.UserAlreadyExisit, AppEnums.DialogType.Error, null, null, this.resources.Close);
          console.log(error)
        });
      });
    });
  }

  public gSignOut() {

    gapi.auth2.getAuthInstance().signOut().then(function () {
      //document.getElementsByClassName("userContent")[0].innerHTML = '';
      //document.getElementsByClassName("userContent")[0].style.display = "none";
      //document.getElementById("gSignIn").style.display = "block";
    });

    gapi.auth2.getAuthInstance().disconnect();
  }

  public fbLogin() {
    FB.login((res) => {
      // handle the response
      if (res.status === 'connected') {
        // Logged into your webpage and Facebook.
        this.getUserInfo();

      } else {
        // The person is not logged into your webpage or we are unable to tell. 
      }
    }, { scope: 'public_profile,email' });
  }

  public fbLogout() {
    FB.logout(function (response) {
      // Person is now logged out
    });
  }

  private getUserInfo() {

    FB.api(`/me?fields=id,name,email,gender,birthday,first_name,last_name,picture`, (res) => {
      console.log(res);
      //SignUp
      //User Already Logged In
      if (DataStore.get('ActiveUser')) {
        CoreSubjects.onLoginSubject.next(DataStore.get('ActiveUser'));

        return;
      }

      let user: any = {
        Email: res.email,
        Image: res.picture.data.url,
        FirstName: res.first_name,
        LastName: res.last_name,
        LoginProvider: AppEnums.LoginProvider.Facebook,
        DOB: res.birthday,
        ProviderId: res.id
      }

      if (res.gender == "male")
        user.Gender = AppEnums.Gender.Male;
      if (res.gender == "female")
        user.Gender = AppEnums.Gender.Female;


      this.userSVC.Signup(user, true).subscribe((innerRes: any) => {
        //debugger;
        console.log(innerRes);
        DataStore.addUpdate('ActiveUser', innerRes, CoreEnums.StorageLocation.LocalStorge);
        CoreSubjects.onLoginSubject.next(innerRes);
      }, (error: any) => {
        CoreSubjects.onLoginSubject.next({ error: error });
        SharedService.ShowNotificationDialog(this.resources.UserAlreadyExisit, AppEnums.DialogType.Error, null, null, this.resources.Close);

        console.log(error)
      });
    });
  }


}
