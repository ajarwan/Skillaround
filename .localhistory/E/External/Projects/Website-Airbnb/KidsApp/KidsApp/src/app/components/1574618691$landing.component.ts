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

    setTimeout(() => {
      this.initPlacesAPI();
    }, 5000)
  }

  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  }


  initPlacesAPI() {

    var sydney = new google.maps.LatLng(-33.867, 151.195);

    var infowindow = new google.maps.InfoWindow();

    var map = new google.maps.Map(document.getElementById('map'), { center: sydney, zoom: 15 });

    var request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);


    service.findPlaceFromQuery(request, (results, status) => {
      debugger;
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          //createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });




    //var service = new google.maps.places.PlacesService();

  }

  public LoginWithFB() {
    this.smSVC.fbLogin();
  }

  public LogOutFB() {
    this.smSVC.fbLogout();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);

  }



}
