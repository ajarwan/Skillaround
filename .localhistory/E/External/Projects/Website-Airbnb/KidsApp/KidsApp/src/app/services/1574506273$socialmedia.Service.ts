import { Injectable } from '@angular/core';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { DataStore } from '../core/services/dataStrore.service';
import { Observable } from 'rxjs';
import { HttpInterceptor, UrlConfig } from '../core/services/http.interceptor';
import { AppEnums } from '../app.enums';
import { debug } from 'util';
import { UsersService } from '../modules/users/users.service';
import { CoreEnums } from '../core/core.enums';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class SocialMedialService {


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

    gapi.signin2.render('gSignIn', {
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


  }

  public gLoginSuccess(res) {

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
          return;
        }
        let user = {
          Email: res.email,
          Image: res.picture,
          FirstName: res.given_name,
          LastName: res.family_name,
          LoginProvider: AppEnums.LoginProvider.Google
        }
        this.userSVC.Signup(user, true).subscribe((innerRes: any) => {
          debugger;
          console.log(innerRes);

          DataStore.addUpdate('ActiveUser', innerRes, CoreEnums.StorageLocation.LocalStorge);
        }, (error: any) => {
          //ToDO , USer Already Exisit
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


}
