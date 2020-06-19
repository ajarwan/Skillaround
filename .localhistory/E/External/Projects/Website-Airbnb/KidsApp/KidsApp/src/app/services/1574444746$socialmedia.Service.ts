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

  public InitGoogleApis() {

    gapi.signin2.render('gSignIn', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': (res) => {
        this.ongLoginSuccess(res);
      },
      'onfailure': () => {
        console.log('faild')
      }
    });

  }

  public ongLoginSuccess(res) {
    console.log('on Gmail LoginSuccess');

    var profile = res.getBasicProfile();
    console.log('-------profile------------');

    console.log(profile);

    gapi.client.load('oauth2', 'v2', function () {
      var request = gapi.client.oauth2.userinfo.get({
        'userId': 'me'
      });
      request.execute(function (resp) {
        console.log('exeec')
        console.log(resp)
      });
    });
  }

  public gSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      //document.getElementsByClassName("userContent")[0].innerHTML = '';
      //document.getElementsByClassName("userContent")[0].style.display = "none";
      //document.getElementById("gSignIn").style.display = "block";
    });

    auth2.disconnect();
  }


}
