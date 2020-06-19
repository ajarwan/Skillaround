import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { Observable } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html'
})
export class Landing extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  //Get MAp Details By ID ==>https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY



  /******************************************
   * Properties
   * ***************************************/
  @ViewChild('mapElementHidden', null) mapElementHidden;
  public gmapHidden: any;


  @ViewChild('select', null) select: NgSelectComponent;

  public LocationsList: any[] = [];
  public SelectdLocation: any = null;

  public Categories: any[] = [];

  public Activities: any[] = [];
  public ActivityInclude: any[] = ['Thumbnail'];

  public Criteria: any = {};
  public PlaceKeywod: string = '';

  public Ages = SharedService.Lookups.Ages;

  /******************************************
   * Constructor
   * ***************************************/
  constructor(public smSVC: SocialMedialService,
    public adminSVC: AdminService,
    private activitySVC: ActivityService) {
    super();
  }

  public ngOnInit() {

    $('.app_body').addClass('home__page');

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
      //dots:true,
      cssEase: 'linear',
      autoplaySpeed: 2000
    });

    //this.select.filter = () => { };

    this.gmapHidden = new google.maps.Map(this.mapElementHidden.nativeElement);


  }

  public ngOnDestroy() {
    $('.app_body').removeClass('home__page');
  }


  /******************************************
   * Methods
   * ***************************************/

  public LoadCategories() {
    this.adminSVC.FindAllCategories(null, null, null, "Id ASC").subscribe((res: any) => {
      this.Categories = res.d;

      //this.Categories.unshift({ TitleAr: 'الرجاء الإختيار', TitleEn: 'Please Select', Id: -1 });

      //this.Criteria.Category = this.Categories[0];
    })
  }

  public LoadMostRecentActivities() {
    this.activitySVC.FindAllActivities(null, 1, 4, "CreateDate DESC,Id DESC", this.ActivityInclude.join(','), true).subscribe((res: any) => {
      this.Activities = res.d;

      this.Activities.forEach((x: any) => {
        this.activitySVC.FindActivityReviewStatistics(x.Id, false).subscribe((innerRes: any) => {
          if (innerRes) {
            x.TotalReviews = innerRes.TotalReviews;
            x.AvgRate = innerRes.AvgRate;
          }
        });
      })
    });
  }

  public SearchLocations(searchParam: any) {
    //debugger;
    //debugger;

    let key = searchParam.term;

    if (!key) {
      this.LocationsList = [];
      return;
    }
     

    var sessionToken = new google.maps.places.AutocompleteSessionToken();
    var displaySuggestions = (predictions, status) => {
      debugger;
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        //alert(status);
        return;
      }
      this.LocationsList = predictions;
      this.RefreshValue(predictions);
      console.log(this.LocationsList);
      this.select.items = this.LocationsList;





    };

    var service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: key, sessionToken: sessionToken, types: ['establishment'] }, displaySuggestions);
  }

  public RefreshValue(list: any) {
    this.LocationsList = list;
  }

  public OnLocationSelect() {
    if (!this.Criteria.SelectdLocation)
      return;

    console.log(this.Criteria.SelectdLocation);

    let service = new google.maps.places.PlacesService(this.gmapHidden);
    var request = {
      placeId: this.Criteria.SelectdLocation.place_id,
      fields: ['name', 'geometry']
    };

    service.getDetails(request, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {

        this.Criteria.SelectdLocation.Lat = place.geometry.location.lat();
        this.Criteria.SelectdLocation.Lng = place.geometry.location.lng();

      }
    });


  }

  public OnLocationACClose() {
    console.log('closed');

    this.LocationsList = [];
  }

  public OnSerach() {

    let Cri: any = {};

    if (this.Criteria.SelectdLocation) {
      Cri.location = this.Criteria.SelectdLocation.place_id;
      Cri.lat = this.Criteria.SelectdLocation.Lat;
      Cri.lng = this.Criteria.SelectdLocation.Lng;
    }



    if (this.Criteria.From)
      Cri.from = CoreHelper.formatDateForUI(this.Criteria.From, 'MM-dd-yyyy');

    if (this.Criteria.To)
      Cri.to = CoreHelper.formatDateForUI(this.Criteria.To, 'MM-dd-yyyy');

    if (this.Criteria.Category && this.Criteria.Category.Id > 0)
      Cri.categoryid = this.Criteria.Category.Id;

    if (this.Criteria.Age)
      Cri.age = this.Criteria.Age.Id;

    if (this.Criteria.Keyword)
      Cri.keyword = this.Criteria.Keyword;

    this.navigate('activity', Cri);
  }


  public OpenLogin() {
    SharedSubjects.OpenLoginPopup.next();
  }



























  //public SignUpGoogle() {
  //  (<HTMLElement>document.getElementById('gSignIn').firstChild).click();
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
