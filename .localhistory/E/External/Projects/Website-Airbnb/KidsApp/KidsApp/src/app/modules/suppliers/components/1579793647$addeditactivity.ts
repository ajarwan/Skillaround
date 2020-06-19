import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import { AdminService } from '../../admin/admin.service';

declare var $: any;
declare var google: any;

@Component({
  selector: 'suppliers-addeditactivity',
  templateUrl: './addeditactivity.html'
})
export class AddEditActivity extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
  * Properties
  * ***************************************/
  @ViewChild('MapElement', null) MapElement;
  public Geocoder = new google.maps.Geocoder;

  public GmapVisible: any;
  public MapOptions: any;
  public Marks: any[] = [];

  public Activity: any = {};
  public Validations: any = {};

  public Categories: any[] = [];
  public Ages: any[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]






  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.AddActivity);

    this.LoadCategories();
    this.InitMap();
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

  public DrawMap() {
    this.GmapVisible = new google.maps.Map(this.MapElement.nativeElement, this.MapOptions);

    this.GmapVisible.addListener('click', (ev) => {
      console.log(ev);
      this.ClearMarks();
      var marker = new google.maps.Marker({
        position: { lat: ev.latLng.lat(), lng: ev.latLng.lng() },
        map: this.GmapVisible,
        //title: 'Hello World!'
      });
      // marker.setMap(this.GmapVisible);

      this.Marks.push(marker);

      this.Geocoder.geocode({ 'location': marker.position }, (res: any, status: any) => {
        console.log(res);
        if (status == 'OK') {
          if (res[0]) {
            //this.GmapVisible.setZoom(11);
           
            //infowindow.setContent(results[0].formatted_address);
            //infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }

      })

    });

    //Search Map When Moving
    google.maps.event.addListener(this.GmapVisible, 'idle', (ev) => {



      ////If Search Enabled
      //if (!this.FromPinClick)
      //  this.FindAllBordersMarks();
      //else
      //  this.FromPinClick = false;

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
}
