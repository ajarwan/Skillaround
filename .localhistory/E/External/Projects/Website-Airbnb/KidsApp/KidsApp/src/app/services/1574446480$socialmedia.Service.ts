import { Injectable } from '@angular/core';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { DataStore } from '../core/services/dataStrore.service';
import { Observable } from 'rxjs';
import { HttpInterceptor, UrlConfig } from '../core/services/http.interceptor';
import { AppEnums } from '../app.enums';
declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class SocialMedialService {


  constructor() {

  }

  public gSingUp() {

    gapi.auth2.init()
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Full Name: ' + profile.getName());
      console.log('Given Name: ' + profile.getGivenName());
      console.log('Family Name: ' + profile.getFamilyName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    }

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
        console.log('faild')
      }
    });

    document.getElementById('gSignIn').click();
  }

  public gLoginSuccess(res) {

    console.log(res);
    //console.log('on Gmail LoginSuccess');

    var profile = res.getBasicProfile();

    console.log(res.getAuthResponse().id_token);
    //console.log('-------profile------------');

    //console.log(profile);

    gapi.client.load('oauth2', 'v2', function () {
      var request = gapi.client.oauth2.userinfo.get({
        'userId': 'me'
      });
      request.execute(function (resp) {
        //console.log('exeec')
        //console.log(resp)
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
