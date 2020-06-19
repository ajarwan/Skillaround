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
  //Get MAp Details By ID ==>https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY

  @ViewChild('mapElement', null) mapElement;
  @ViewChild('mapElementHidden', null) mapElementHidden;

  public gmapVisible: any;
  public gmapHidden: any;
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
    this.gmapVisible = new google.maps.Map(this.mapElement.nativeElement, { center: sydney, zoom: 15 });
    this.gmapHidden = new google.maps.Map(this.mapElementHidden.nativeElement);

    var request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    };

    let service = new google.maps.places.PlacesService(this.gmapVisible);


    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          //createMarker(results[i]);
        }
        this.gmapVisible.setCenter(results[0].geometry.location);
      }
    });




    //var service = new google.maps.places.PlacesService();

  }


  public place: string = '';

  public Search() {



    var sessionToken = new google.maps.places.AutocompleteSessionToken();

    var displaySuggestions = (predictions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      predictions.forEach((prediction) => {
        service = new google.maps.places.PlacesService(this.gmapHidden);
        console.log(prediction)
        var request = {
          placeId: prediction.place_id,
          fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
        };

        service.getDetails(request, (place, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(place);
          }

        });

      });

    };


    var service = new google.maps.places.AutocompleteService();

    service.getQueryPredictions({ input: this.place, sessionToken: sessionToken }, displaySuggestions);
  }


}
