import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import { environment } from 'src/environments/environment';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { Validator } from 'src/app/core/services/validator';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/modules/users/users.service';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

declare var $: any;
declare var google: any;

export enum PlaceType {
  Map = 1,
  ClientLocation = 2,
  OnLine = 3
}

@Component({
  selector: 'shared-addeditactivity',
  templateUrl: './addeditactivity.html'
})
export class AddEditActivity extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
  * Properties
  * ***************************************/
  @ViewChild('MapElement', null) MapElement;
  @ViewChild('fileUpload', null) fileUpload: ElementRef;
  public SearchCountryField = SearchCountryField;
  public TooltipLabel = TooltipLabel;
  public CountryISO = CountryISO;

  public PlaceType = PlaceType;

  public Geocoder = new google.maps.Geocoder;

  public GmapVisible: any;
  public MapOptions: any;
  public Marks: any[] = [];

  public Activity: any = {
  };
  public Validations: any = {};

  public Categories: any[] = [];
  public Ages: any[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  public IsLoading: boolean = false;
  public IsLoadingAttachments: boolean = false;


  public ActivityId: number = null;
  public PageMode: AppEnums.PageMode = AppEnums.PageMode.Add;
  public ActivityIncludes: any[] = ['Category'];

  get FormattedPrice() {
    if (this.Activity && this.Activity.Price) {
      return "(" + this.formatMony(this.Activity.Price) + ")";
    }
    else
      return "";
  }
  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService,
    private route: ActivatedRoute,
    private sharedSVC: SharedService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    this.LoadCategories();

    this.ActivityId = this.route.snapshot.params['id'];
    if (this.ActivityId) {
      this.PageMode = AppEnums.PageMode.Edit;
      DataStore.addUpdate('SupplierModulePageTitle', this.resources.EditActivity);
      this.LoadActivityDetails();
    }
    else {
      this.PageMode = AppEnums.PageMode.Add;
      DataStore.addUpdate('SupplierModulePageTitle', this.resources.AddActivity);
      this.InitMap();
    }




  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadCategories() {
    this.adminSVC.FindAllCategories(null, null, null, "Id ASC").subscribe((res: any) => {
      this.Categories = res.d;
    })
  }

  public LoadActivityDetails() {
    this.IsLoading = true;
    this.activitySCV.FindActivityById(this.ActivityId, this.ActivityIncludes.join(','), false).subscribe((res: any) => {
      this.IsLoading = false;

      if (res.SupplierId) {
        if (res.SupplierId != this.ActiveUser.Id) {
          this.navigate('supplier/activities');
        }
      }
      else if (this.ActiveUser.UserType != AppEnums.UserTypes.Manager) {
        this.navigate('supplier/activities');
      }

      this.Activity = res;

      if (this.Activity.From)
        this.Activity.From = SharedService.ResponeToDate(this.Activity.From);

      if (this.Activity.To)
        this.Activity.To = SharedService.ResponeToDate(this.Activity.To);

      this.activitySCV.FindAllActivityDocuments(this.ActivityId, false).subscribe((innreRes: any) => {
        this.Activity.Documents = innreRes.d;
      });

      this.InitMap();

    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((response: any) => {
        this.navigate('supplier/activities')
      })
    })
  }

  public DrawMap() {

    if (this.Activity && this.Activity.Lat && this.Activity.Lng) {
      this.MapOptions.center = new google.maps.LatLng(this.Activity.Lat, this.Activity.Lng);
    }

    this.GmapVisible = new google.maps.Map(this.MapElement.nativeElement, this.MapOptions);

    if (this.PageMode == AppEnums.PageMode.Edit)
      this.DrawMark(this.Activity.Lat, this.Activity.Lng);


    this.GmapVisible.addListener('click', (ev) => {
      //console.log(ev);

      this.DrawMark(ev.latLng.lat(), ev.latLng.lng())
      //this.ClearMarks();
      //var marker = new google.maps.Marker({
      //  position: { lat: ev.latLng.lat(), lng: ev.latLng.lng() },
      //  map: this.GmapVisible,
      //  //title: 'Hello World!'
      //});

      //this.Marks.push(marker);
      this.Activity.Lat = ev.latLng.lat();
      this.Activity.Lng = ev.latLng.lng();

      this.Geocoder.geocode({ 'location': { lat: ev.latLng.lat(), lng: ev.latLng.lng() } }, (res: any, status: any) => {
        if (status == 'OK') {
          if (res[0]) {
            this.GetCityNameFromResponseList(res);
          }
        }
      });



    });

    //Select Current Location By Default 
    if (this.PageMode == AppEnums.PageMode.Add) {
      //console.log(this.MapOptions.center);
      this.Activity.Lat = this.MapOptions.center.lat();
      this.Activity.Lng = this.MapOptions.center.lng();
      this.DrawMark(this.MapOptions.center.lat(), this.MapOptions.center.lng());
      this.Geocoder.geocode({ 'location': { lat: this.MapOptions.center.lat(), lng: this.MapOptions.center.lng() } }, (res: any, status: any) => {
        if (status == 'OK') {
          if (res[0]) {
            this.GetCityNameFromResponseList(res);
          }
        }
      });

    }


    var centerControlDiv = document.createElement('div');
    var centerControl = this.CenterControl(centerControlDiv);

    this.GmapVisible.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  }

  public CenterControl(controlDiv: any) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = this.resources.ClickToGoToCurrentLocation;// 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.textContent = this.resources.CurrentLocation;//'Center Map';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    let me = this;
    controlUI.addEventListener('click', function () {


      navigator.geolocation.getCurrentPosition((pos) => {
        var current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        me.GmapVisible.setCenter(current);
      })


    });

  }

  public InitMap() {

    this.MapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      panControl: false,
      panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scrollwheel: false,
      scaleControl: false,
      scaleControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      styles: [
        {
          "featureType": "administrative.country",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "landscape.natural.landcover",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "landscape.natural.terrain",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.attraction",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.government",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.medical",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.place_of_worship",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.sports_complex",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.station.airport",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.station.bus",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.station.rail",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    };



    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.MapOptions.center = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.DrawMap();
      })
    }
    else {
      let Lat = '25.2048493';
      let Lng = '55.2707828';
      this.MapOptions.center = new google.maps.LatLng(Lat, Lng);
      this.DrawMap();
    }

  }

  public ClearMarks() {
    this.Marks.forEach((x: any) => {

      x.setMap(null);
    })
  }

  public DrawMark(lat: any, lng: any) {
    this.ClearMarks();
    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.GmapVisible,
      //title: 'Hello World!'
    });

    this.Marks.push(marker);
  }

  public GetCityNameFromResponseList(results: any[]) {
    //let city: any;

    console.log(results);

    let possiblecity = results.filter((x: any) => x.types && x.types.some((y: any) => y == 'locality') && x.types.some((y: any) => y == 'political'))[0];
    console.log(possiblecity);

    if (!possiblecity)
      possiblecity = results.filter((x: any) => x.types && x.types.some((y: any) => y == 'administrative_area_level_1') && x.types.some((y: any) => y == 'political'))[0];

    if (!possiblecity)
      possiblecity = results.filter((x: any) => x.types && x.types.some((y: any) => y == 'administrative_area_level_1'))[0];

    let city = possiblecity.address_components.filter((x: any) => x.types.some((y: any) => y == 'administrative_area_level_1'))[0];

    console.log(city);

    ////debugger;
    //for (var i = 0; i < results[results.length - 2].address_components.length; i++) {
    //  for (var b = 0; b < results[results.length - 2].address_components[i].types.length; b++) {

    //    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
    //    if (results[results.length - 2].address_components[i].types[b] == "administrative_area_level_1") {
    //      //this is the object you are looking for
    //      city = results[results.length - 2].address_components[i];
    //      city.locationId = results[results.length - 2].place_id;
    //      break;
    //    }
    //  }
    //}
    ////city data
    //console.log(city);
    ////alert(city.short_name + " " + city.long_name)
    this.Marks[0].cityName = city.long_name;

    this.Activity.LocationName = city.long_name;
    this.Activity.LocationId = possiblecity.place_id;

  }

  public async OnUploadImage(event: any) {

    if (event.target.files[0] && environment.AllowedImagesExtension.toLowerCase().indexOf((event.target.files[0].name.split('.').pop()).toLowerCase()) == -1) {
      return;
    }

    if (!this.Activity.Documents)
      this.Activity.Documents = [];

    var isMain = this.Activity.Documents.filter((x: any) => !x.IsDeleted).length == 0;

    //this.Activity.Documents.push({
    //  File: await this.ConvertToBase64(event.target.files[0]),
    //  IsMain: isMain,
    //  Guid: CoreHelper.NewGuid()
    //});

    this.IsLoadingAttachments = true;
    this.sharedSVC.UploadFile({
      File: event.target.files[0],
      Type: AppEnums.AttachmentLocationType.Activity,
      Ext: CoreHelper.GetFileExtension(event.target.files[0].name)
    }).subscribe((res: any) => {
      console.log(res);

      this.Activity.Documents.push({
        File: environment.MainEndPoint + res,
        IsMain: isMain,
        Guid: CoreHelper.NewGuid()
      });

      $(this.fileUpload.nativeElement).val('')
      this.IsLoadingAttachments = false;
    })


  }

  public SetMainImage(img: any) {

    this.Activity.Documents.forEach((x: any) => {
      x.IsMain = false;
      x.State = AppEnums.BaseState.Modified
    });

    img.IsMain = true;
  }

  public OnDeleteImage(img: any) {

    if (img.Id) {
      img.State = AppEnums.BaseState.Deleted;
      img.IsDeleted = true;
    }
    else {
      this.Activity.Documents = this.Activity.Documents.filter((x: any) => x.Guid != img.Guid);
    }

    if (img.IsMain) {
      if (this.Activity.Documents.filter((x: any) => !x.IsDeleted).length > 0) {
        this.Activity.Documents.filter((x: any) => !x.IsDeleted)[0].IsMain = true;
        this.Activity.Documents.filter((x: any) => !x.IsDeleted)[0].State = AppEnums.BaseState.Modified;
      }
    }

  }

  public OnSave() {

    if (!this.ValidateActivity())
      return;


    if (this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.Activity.SupplierId = this.ActiveUser.Id;

    this.IsLoading = true;



    if (this.PageMode == AppEnums.PageMode.Edit) {
      this.activitySCV.UpdateActivity(this.Activity, false).subscribe((res: any) => {
        this.OnAddUpdateSuccess(res.Id);
      }, (err: any) => {
        this.OnAddUpdateError();
      })
    }
    else {

      this.activitySCV.AddActivity(this.Activity, false).subscribe((res: any) => {
        this.OnAddUpdateSuccess(res.Id);
      }, (err: any) => {
        this.OnAddUpdateError();
      })

    }


  }

  public ValidateActivity(): boolean {

    this.Validations = {};

    if (Validator.StringIsNullOrEmpty(this.Activity.TitleAr))
      this.Validations.TitleAr = true;


    if (Validator.StringIsNullOrEmpty(this.Activity.TitleEn))
      this.Validations.TitleEn = true;

    if (Validator.StringIsNullOrEmpty(this.Activity.DescriptionAr))
      this.Validations.DescriptionAr = true;

    if (Validator.StringIsNullOrEmpty(this.Activity.DescriptionEn))
      this.Validations.DescriptionEn = true;


    if (!this.Activity.Category)
      this.Validations.Category = true;

    if (this.Activity.AgeFrom && this.Activity.AgeTo) {
      if (this.Activity.AgeFrom > this.Activity.AgeTo)
        this.Validations.Age = true;
    }

    if (!this.Activity.AtUserLocation && !this.Activity.OnlineLocation) {
      if (Validator.StringIsNullOrEmpty(this.Activity.LocationName) || Validator.StringIsNullOrEmpty(this.Activity.Lat) || Validator.StringIsNullOrEmpty(this.Activity.Lng))
        this.Validations.LocationName = true;
    }



    if (!this.Activity.Documents || this.Activity.Documents.filter((x: any) => !x.IsDeleted).length < 5)
      this.Validations.Documents = true;


    if (this.ActiveUser.UserType == AppEnums.UserTypes.Manager) {
      if (Validator.StringIsNullOrEmpty(this.Activity.SupplierName))
        this.Validations.SupplierName = true;

      if (Validator.StringIsNullOrEmpty(this.Activity.SupplierEmail))
        this.Validations.SupplierEmail = true;

      if (!Validator.IsValidEmail(this.Activity.SupplierEmail))
        this.Validations.SupplierEmail = true;

      if (this.Activity.SupplierPhoneNumber && this.Activity.SupplierPhoneNumber.internationalNumber)
        this.Activity.SupplierPhoneNumber = this.Activity.SupplierPhoneNumber.internationalNumber;
      else
        this.Activity.SupplierPhoneNumber = '';

      if (Validator.StringIsNullOrEmpty(this.Activity.SupplierPhoneNumber))
        this.Validations.SupplierPhoneNumber = true;
    }

    if (Object.getOwnPropertyNames(this.Validations).length > 0)
      return false;

    return true;
  }

  public OnAddUpdateSuccess(id: any) {
    this.IsLoading = false;
    Swal.fire({
      icon: 'success',
      text: this.resources.SavedSuccessfully,
      showConfirmButton: true,
      confirmButtonText: this.resources.Acknowldge
    }).then((res: any) => {

      if (this.ActiveUser.UserType == AppEnums.UserTypes.Manager) {
        this.navigate('admin/managedactivities/details/' + id);
      } else {
        this.navigate('supplier/activities/details/' + id);
      }

    })
  }

  public OnAddUpdateError() {
    this.IsLoading = false;
    Swal.fire({
      icon: 'error',
      text: this.resources.ErrorWhileSave,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    })
  }

  public OnToggleLocationPlace(type: PlaceType) {


    switch (type) {
      case PlaceType.Map:
        this.Activity.AtUserLocation = false;
        this.Activity.OnlineLocation = false;
        break;
      case PlaceType.ClientLocation:
        this.Activity.AtUserLocation = true;
        this.Activity.OnlineLocation = false;
        break;
      case PlaceType.OnLine:
        this.Activity.AtUserLocation = false;
        this.Activity.OnlineLocation = true;
        break;
    }


  }
}
