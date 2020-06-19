import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('map', null) map;

  constructor(public smSVC: SocialMedialService) {
    super();
  }



  ngOnInit() {

    this.initPlacesAPI();
  }

  public SignUpGoogle() {
    (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  }

  public SignOutGoogle() {
    this.smSVC.gSignOut();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  }

  public LoginWithFB() {
    this.smSVC.fbLogin();
  }

  public LogOutFB() {
    this.smSVC.fbLogout();
    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);

  }



  initPlacesAPI() {

    var sydney = new google.maps.LatLng(-33.867, 151.195);

    var infowindow = new google.maps.InfoWindow();
    console.log(this.map.nativeElement);
    var map = new google.maps.Map(this.map.nativeElement, { center: sydney, zoom: 15 });

    var request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);


    service.findPlaceFromQuery(request, (results, status) => {
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


  public place: string = '';

  public Search() {


    var displaySuggestions = (predictions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      predictions.forEach((prediction) => {
        console.log(prediction);
      });

    };


    var service = new google.maps.places.AutocompleteService();

    service.getQueryPredictions({ input: this.place }, displaySuggestions);
  }


}
