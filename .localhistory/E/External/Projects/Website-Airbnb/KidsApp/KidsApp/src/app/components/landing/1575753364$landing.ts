import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale, arLocale } from 'ngx-bootstrap/locale';
import { ActivityService } from 'src/app/modules/activity/activity.service';
declare var google: any;
declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html'
})
export class Landing extends BaseComponent implements OnInit, AfterViewInit {
  //Get MAp Details By ID ==>https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY

  @ViewChild('mapElement', null) mapElement;
  @ViewChild('mapElementHidden', null) mapElementHidden;

  locationsList: any[] = [];

  public gmapVisible: any;
  public gmapHidden: any;



  public dbConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-blue'
  };


  public Categories: any[] = [];

  public Activities: any[] = [];
  public ActivityInclude: any[] = ['Thumbnail'];

  public Criteria: any = {};
  public PlaceKeywod: string = '';


  constructor(public smSVC: SocialMedialService,
    public adminSVC: AdminService,
    private localeService: BsLocaleService,
    private activitySVC: ActivityService) {
    super();
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);

  }

  public ngOnInit() {
    this.localeService.use(environment.Lang);
    //this.initPlacesAPI();

    this.LoadCategories();
    this.LoadMostRecentActivities();
  }

  public ngAfterViewInit() {

    $('.banner-slider').slick({
      infinite: true,
      slidesToShow: 1,
      speed: 900,
      rtl: environment.Lang == 'ar' ? true : false,
      autoplay: true,
      arrows: true,
      fade: true,
      cssEase: 'linear',
      autoplaySpeed: 2000
    });
  }




  public LoadCategories() {
    this.adminSVC.FindAllCategories(null).subscribe((res: any) => {
      this.Categories = res.d;

      this.Categories.unshift({ TitleAr: 'الرجاء الإختيار', TitleEn: 'Please Select', Id: -1 });
    })
  }


  public SearchLocations() {

    var sessionToken = new google.maps.places.AutocompleteSessionToken();
    var displaySuggestions = (predictions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      this.locationsList = predictions;
      console.log(this.locationsList);
      //predictions.forEach((prediction) => {
      //  service = new google.maps.places.PlacesService(this.gmapHidden);
      //  console.log(prediction)
      //  var request = {
      //    placeId: prediction.place_id,
      //    fields: ['name', 'geometry']
      //  };

      //  service.getDetails(request, (place, status) => {
      //    if (status == google.maps.places.PlacesServiceStatus.OK) {
      //      var obg = {
      //        name: place.name,
      //        id: prediction.place_id,
      //        lat: place.geometry.location.lat(),
      //        lng: place.geometry.location.lng(),
      //      }
      //      console.log(obg);
      //    }
      //  });
      //});

    };

    var service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: this.PlaceKeywod, sessionToken: sessionToken }, displaySuggestions);
  }

  public LoadMostRecentActivities() {
    this.activitySVC.FindAllActivities(null, 1, 4, "CreateDate DESC,Id DESC", this.ActivityInclude.join(','), true).subscribe((res: any) => {
      this.Activities = res.d;

      this.Activities.forEach((x: any) => {

      })
    });
  }
































  //public SignUpGoogle() {
  //  (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
  //}

  //public SignOutGoogle() {
  //  this.smSVC.gSignOut();
  //  DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
  //}

  //public LoginWithFB() {
  //  this.smSVC.fbLogin();
  //}

  //public LogOutFB() {
  //  this.smSVC.fbLogout();
  //  DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);

  //}

  //initPlacesAPI() {

  //  var sydney = new google.maps.LatLng(-33.867, 151.195);

  //  var infowindow = new google.maps.InfoWindow();
  //  this.gmapVisible = new google.maps.Map(this.mapElement.nativeElement, { center: sydney, zoom: 15 });
  //  this.gmapHidden = new google.maps.Map(this.mapElementHidden.nativeElement);

  //  var request = {
  //    query: 'Museum of Contemporary Art Australia',
  //    fields: ['name', 'geometry'],
  //  };

  //  let service = new google.maps.places.PlacesService(this.gmapVisible);


  //  service.findPlaceFromQuery(request, (results, status) => {
  //    if (status === google.maps.places.PlacesServiceStatus.OK) {
  //      for (var i = 0; i < results.length; i++) {
  //        console.log(results[i]);
  //        //createMarker(results[i]);
  //      }
  //      this.gmapVisible.setCenter(results[0].geometry.location);
  //    }
  //  });




  //  //var service = new google.maps.places.PlacesService();

  //}


  //public place: string = '';

  //public Search() {

  //  var sessionToken = new google.maps.places.AutocompleteSessionToken();

  //  var displaySuggestions = (predictions, status) => {
  //    if (status != google.maps.places.PlacesServiceStatus.OK) {
  //      alert(status);
  //      return;
  //    }

  //    this.locationsList = predictions;

  //    console.log(this.locationsList);
  //    //predictions.forEach((prediction) => {
  //    //  service = new google.maps.places.PlacesService(this.gmapHidden);
  //    //  console.log(prediction)
  //    //  var request = {
  //    //    placeId: prediction.place_id,
  //    //    fields: ['name', 'geometry']
  //    //  };

  //    //  service.getDetails(request, (place, status) => {
  //    //    if (status == google.maps.places.PlacesServiceStatus.OK) {
  //    //      var obg = {
  //    //        name: place.name,
  //    //        id: prediction.place_id,
  //    //        lat: place.geometry.location.lat(),
  //    //        lng: place.geometry.location.lng(),
  //    //      }
  //    //      console.log(obg);
  //    //    }

  //    //  });

  //    //});

  //  };


  //  var service = new google.maps.places.AutocompleteService();

  //  service.getQueryPredictions({ input: this.place, sessionToken: sessionToken }, displaySuggestions);
  //}

  //public onLocationClick(location: any) {
  //  let service = new google.maps.places.PlacesService(this.gmapHidden);
  //  var request = {
  //    placeId: location.place_id,
  //    fields: ['name', 'geometry']
  //  };

  //  service.getDetails(request, (place, status) => {
  //    if (status == google.maps.places.PlacesServiceStatus.OK) {
  //      var obg = {
  //        name: place.name,
  //        id: location.place_id,
  //        lat: place.geometry.location.lat(),
  //        lng: place.geometry.location.lng(),
  //      }
  //      console.log(obg);
  //    }
  //  });
  //}

}
