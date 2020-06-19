import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivatedRoute } from '@angular/router';
import { DatePickerComponent, BsDaterangepickerContainerComponent } from 'ngx-bootstrap';
import { CoreHelper } from 'src/app/core/services/core.helper';

declare var $: any;
declare var google: any;
declare var navigator: any;
declare var InfoBox: any;

enum FilterType {
  Date = 1,
  Category = 2,
  Price = 3,
  Age = 4,
  Transportation = 5
}
@Component({
  selector: 'activity-list',
  templateUrl: './activitylist.html'
})
export class ActivityList extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  @ViewChild('MapElement', null) MapElement;
  public MapOptions: any;
  public GmapVisible: any;
  public MapMarks: any[] = [];
  public FromPinClick: boolean = false;
  public CurrentMarksData: any[] = [];

  public Criteria: any = {
    TransportationStatus: AppEnums.TransportationFilter.All
  };

  public FinalCriteria: any = {};

  public Pager = new Pager(1, 10, 0, 0);
  public Categories: any[] = [];
  public MinPrice: any = 0;
  public MaxPrice: any = 0;
  public FilterType = FilterType;

  public Activities = [];
  public ActivityInclude: any[] = ['Thumbnail'];

  public Ages: any[] = [
    { Title: '3 yrs -5 yrs', Id: 1, AgeFrom: 3, AgeTo: 5 },
    { Title: '6 yrs -9 yrs', Id: 2, AgeFrom: 6, AgeTo: 9 },
    { Title: '10 yrs -13 yrs', Id: 3, AgeFrom: 10, AgeTo: 13 },
    { Title: '14 yrs -16 yrs', Id: 4, AgeFrom: 14, AgeTo: 16 },
  ];
  @ViewChild('popCat', null) popCat: any;
  @ViewChild('popAge', null) popAge: any;
  @ViewChild('popTrans', null) popTrans: any;



  public MapVisible: boolean = true;

  public get GetTransLabel() {
    if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.All)
      return this.resources.TransportationAvailable
    else if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.Available)
      return this.resources.TransportationAvailable + ' : ' + this.resources.Yes
    if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.NotAvailable)
      return this.resources.TransportationAvailable + ' : ' + this.resources.No
  }

  /*************************************
   *  Constructor
   *************************************/
  constructor(public activitySVC: ActivityService,
    public adminSVC: AdminService,
    private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {

    console.log('1');
    this.route.queryParams.subscribe((res: any) => {
      console.log(res);
      if (res) {
        if (res.location) {
          this.Criteria.LocationId = res.location
        }

        if (res.lat) {
          this.Criteria.Lat = res.lat
        }

        if (res.lng) {
          this.Criteria.Lng = res.lng
        }

        if (res.from && res.to) {
          var dateFrom = new Date(res.from);
          dateFrom.setDate(dateFrom.getDate() + 1);

          var dateTo = new Date(res.to);
          dateTo.setDate(dateTo.getDate() + 1);

          this.Criteria.DateRangeTemp = [dateFrom, dateTo]
          this.Criteria.DateRange = [res.from, res.To]

        }

        if (res.categoryid) {
          this.Criteria.Category = { Id: res.categoryid }
        }

        if (res.lat) {
          this.Criteria.Lat = res.lat;
        }

        if (res.lng) {
          this.Criteria.Lng = res.lng
        }

        if (res.maxprice) {
          this.Criteria.MaxPrice = res.maxprice
        }

        if (res.minprice) {
          this.Criteria.MinPrice = res.minprice
        }

        if (res.age) {
          this.Criteria.Age = this.Ages.filter((x: any) => x.Id == res.age)[0];
        }

        if (res.trans) {
          this.Criteria.TransportationStatus = res.trans;
        }

        this.FinalCriteria = this.clone(this.Criteria);
      }
    }).unsubscribe();

    console.log('2');
    this.LoadCategories();
    this.LoadPriceRange();
    this.LoadActivities();
    this.InitMap();
  }

  public ngAfterViewInit() {

    //$('#shSwitch').btnSwitch({
    //  Theme: 'Light',
    //  OnValue: 'On',
    //  OnCallback: function (val) {
    //    $('.listing-section').addClass('hideMap');
    //  },
    //  OffValue: 'Off',
    //  OffCallback: function (val) {
    //    $('.listing-section').removeClass('hideMap');
    //  }
    //});
  }

  /*************************************
   *  Methods
   *************************************/
  public LoadCategories() {
    this.adminSVC.FindAllCategories(null, null, null, 'Id ASC').subscribe((res: any) => {
      this.Categories = res.d;

      if (this.Criteria.Category) {
        this.Criteria.Category = this.Categories.filter((x: any) => x.Id == this.Criteria.Category.Id)[0];
      }
    })
  }

  public LoadPriceRange() {
    this.activitySVC.FindActivityPriceRange().subscribe((res: any) => {
      this.MinPrice = res.MinPrice;
      this.MaxPrice = res.MaxPrice;
      //debugger;
      $("#price").val("$" + (this.Criteria.MinPrice ? this.Criteria.MinPrice : this.MinPrice) + " - $" + (this.Criteria.MaxPrice ? this.Criteria.MaxPrice : this.MaxPrice));
    })
  }

  public LoadActivities() {

    if (this.FinalCriteria.Age) {
      this.FinalCriteria.AgeFrom = this.FinalCriteria.Age.AgeFrom;
      this.FinalCriteria.AgeTo = this.FinalCriteria.Age.AgeTo;
    };

    if (this.FinalCriteria.DateRange && this.FinalCriteria.DateRange.length > 0) {
      this.FinalCriteria.FromDate = this.FinalCriteria.DateRange[0];
      this.FinalCriteria.ToDate = this.FinalCriteria.DateRange[1];
    };

    this.DrawQueryString();
    this.activitySVC.FindAllActivities(this.FinalCriteria, this.Pager.PageIndex, this.Pager.PageSize, 'CreateDate DESC, Id DESC', this.ActivityInclude.join(','), true).subscribe((res: any) => {
      this.Activities = res.d;
      this.Pager = res.pager;

      this.Activities.forEach((x: any) => {
        this.activitySVC.FindActivityReviewStatistics(x.Id, false).subscribe((innerRes: any) => {
          if (innerRes) {
            x.TotalReviews = innerRes.TotalReviews;
            x.AvgRate = innerRes.AvgRate;
          }
        });
      })
    })
  }

  public SetSelectedCategory(cat: any) {
    this.Criteria.Category = cat;
  }

  public OnPriceShown() {
    let me = this;
    $("#mySlider").slider({
      range: true,
      min: parseInt(this.MinPrice),
      max: parseInt(this.MaxPrice),
      values: [me.Criteria.MinPrice ? me.Criteria.MinPrice : this.MinPrice, me.Criteria.MaxPrice ? me.Criteria.MaxPrice : this.MaxPrice],
      slide: function (event, ui) {
        $("#price").val("$" + ui.values[0] + " - $" + ui.values[1]);

        me.Criteria.MaxPrice = ui.values[1];
        me.Criteria.MinPrice = ui.values[0];
      }
    });
  }

  public SetSelectedAge(age: any) {
    this.Criteria.Age = age;

  }

  public SetSelectedTrans(trans: AppEnums.TransportationFilter) {
    this.Criteria.TransportationStatus = trans;

  }

  public OnFilterApply(type: FilterType, val: any = null) {

    switch (type) {
      case FilterType.Date:
        console.log(this.Criteria);
        this.Criteria.DateRange = this.Criteria.DateRangeTemp;
        //this.FinalCriteria.DateRange = this.Criteria.DateRange;
        break;
      case FilterType.Category:
        //this.FinalCriteria.Category = this.Criteria.Category;
        break;
      case FilterType.Price:
        //this.FinalCriteria.Price = this.Criteria.Price;
        break;
      case FilterType.Age:
        //this.FinalCriteria.Age = this.Criteria.Age;
        break;
      case FilterType.Transportation:
        //this.FinalCriteria.Transportatio = this.Criteria.Age;
        break;
    }

    this.popCat.hide();
    this.popAge.hide();
    this.popTrans.hide();

    this.FinalCriteria = this.clone(this.Criteria);
    this.Pager.PageIndex = 1;
    this.LoadActivities();
    this.FindAllBordersMarks();
  }

  public OnFilterClear(type: FilterType) {

    switch (type) {
      case FilterType.Date:
        this.Criteria.DateRange = null;
        break;
      case FilterType.Category:
        this.Criteria.Category = null;
        break;
      case FilterType.Price:
        //this.FinalCriteria.Price = this.Criteria.Price;
        break;
      case FilterType.Age:
        this.Criteria.Age = null;
        break;
      case FilterType.Transportation:
        this.Criteria.TransportationStatus = AppEnums.TransportationFilter.All
        break;
    }

    this.popCat.hide();
    this.popAge.hide();
    this.popTrans.hide();

    this.FinalCriteria = this.clone(this.Criteria);
    this.LoadActivities();
  }

  public OnPageChange(pageIndex: number) {
    this.Pager.PageIndex = pageIndex;
    this.LoadActivities();
  }

  public DrawQueryString() {

    let updatedParams: any = {}

    if (this.FinalCriteria.LocationId)
      updatedParams.location = this.FinalCriteria.LocationId;


    if (this.FinalCriteria.Lat)
      updatedParams.lat = this.FinalCriteria.Lat;

    if (this.FinalCriteria.Lng)
      updatedParams.lng = this.FinalCriteria.Lng;

    if (this.FinalCriteria.DateRange && this.FinalCriteria.DateRange.length > 1) {
      updatedParams.from = CoreHelper.formatDateForUI(this.FinalCriteria.DateRange[0], 'MM-dd-yyyy');
      updatedParams.to = CoreHelper.formatDateForUI(this.FinalCriteria.DateRange[1], 'MM-dd-yyyy');
    }

    if (this.FinalCriteria.Category)
      updatedParams.categoryid = this.FinalCriteria.Category.Id;

    if (this.FinalCriteria.MaxPrice)
      updatedParams.maxprice = this.FinalCriteria.MaxPrice;

    if (this.FinalCriteria.MinPrice)
      updatedParams.minprice = this.FinalCriteria.MinPrice;

    if (this.FinalCriteria.Age)
      updatedParams.age = this.FinalCriteria.Age.Id;

    if (this.FinalCriteria.TransportationStatus)
      updatedParams.trans = this.FinalCriteria.TransportationStatus;


    this.appRouter.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: updatedParams,
        queryParamsHandling: 'merge'
      });




  }

  /************************************
   * Map Related Functions
   ************************************/
  public ToggleMap() {

    if (this.MapVisible)
      this.MapVisible = false;
    else
      this.MapVisible = true;

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


    if (this.Criteria.Lat && this.Criteria.Lng) {
      this.MapOptions.center = new google.maps.LatLng(this.Criteria.Lat, this.Criteria.Lng);
      this.DrawMap();
    }
    else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {

          this.Criteria.Lat = pos.coords.latitude;
          this.Criteria.Lng = pos.coords.longitude;

          this.MapOptions.center = new google.maps.LatLng(this.Criteria.Lat, this.Criteria.Lng);
          this.DrawMap();
        })
      }
      else {
        this.Criteria.Lat = '25.2048493';
        this.Criteria.Lng = '55.2707828';
        this.MapOptions.center = new google.maps.LatLng(this.Criteria.Lat, this.Criteria.Lng);
        this.DrawMap();
      }
    }
  }

  public DrawMap() {
    this.GmapVisible = new google.maps.Map(this.MapElement.nativeElement, this.MapOptions);

    //Search Map When Moving
    google.maps.event.addListener(this.GmapVisible, 'idle', (ev) => {
      //If Search Enabled
      if (!this.FromPinClick)
        this.FindAllBordersMarks();
      else
        this.FromPinClick = false;

    });


    let me = this;
    google.maps.event.addListener(this.GmapVisible, 'click', function (event) {
      console.log("Latitude: " + event.latLng.lat() + " " + ", longitude: " + event.latLng.lng());
      me.HideAllMarkers();
    });
  }

  public FindAllBordersMarks() {


    var bounds = this.GmapVisible.getBounds();
    var ne = bounds.getNorthEast(); // LatLng of the north-east corner
    var sw = bounds.getSouthWest(); // LatLng of the south-west corder


    //console.log('NE Lat', + ne.lat())
    //console.log('NE Lng', + ne.lng())

    //console.log('SW Lat', + sw.lat())
    //console.log('SW Lng', + sw.lng())
    //console.log(bounds);

    this.FinalCriteria.GLat = ne.lat();
    this.FinalCriteria.GLng = ne.lng();
    this.FinalCriteria.SLat = sw.lat();
    this.FinalCriteria.SLng = sw.lng();

    let me = this;

    this.activitySVC.FindAllMapMarks(this.FinalCriteria).subscribe((res: any) => {
      //First Clear All MArks
      if (res.d && res.d.length > 0) {

        let MarksData = res.d.filter((x: any) => this.CurrentMarksData.find((y) => y.Id == x.Id) == null);
        let RemovedIds = this.CurrentMarksData.filter((x: any) => res.d.find((y) => y.Id == x.Id) == null).map((x: any) => x.Id);
        this.RemoveAllMapMarks(RemovedIds);

        MarksData.forEach((x: any) => {

          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(x.Lat, x.Lng),
            map: this.GmapVisible,
            icon: 'assets/images/pins/' + 'Hotels' + '.png',
            Id: x.Id
          });

          //marker.setAnimation(google.maps.Animation.DROP);
          me.MapMarks.push(marker);

          google.maps.event.addListener(marker, 'click', function () {
            me.FromPinClick = true;
            console.log(event);
            me.CloseMapMark();
            me.OpenMapMark(x, this);
            //getInfoBox(item).open(mapObject, this);

            me.GmapVisible.setCenter(new google.maps.LatLng(x.Lat, x.Lng));

          });
        });

        this.CurrentMarksData = res.d;
      }
      else {
        this.RemoveAllMapMarks([]);
      }

    })

  }

  public RemoveAllMapMarks(Ids: number[]) {


    this.MapMarks.filter((x: any) => Ids.indexOf(x.Id) > -1).forEach((x: any) => {
      console.log(x);
      x.setMap(null);
    });
  }

  public CloseMapMark() {
    $('div.infoBox').remove();
  }

  public OpenMapMark(item: any, context: any) {


    let box = new InfoBox({
      content:
        '<div class="marker_info_2">' +
        '<img style="width:240px;height:140px" src="' + item.Image + '" alt="Image"/>' +
        '<h3>' + item.Title + '</h3>' +
        '<span>' + CoreHelper.TruncateText(item.Description) + '</span>' +
        '<div class="marker_tools">' +
        '<button type="submit" value="Get directions" class="btn_infobox_get_directions">Directions</button>' +
        '<a href="tel://' + item.SupplierPhoneNumber + '" class="btn_infobox_phone">' + item.SupplierPhoneNumber + '</a>' +
        '</div>' +
        '<a target="_blank" href="activity/details/' + item.Id + '" class="btn_infobox">Details</a>' +
        '</div>',
      disableAutoPan: false,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(10, 125),
      closeBoxMargin: '5px -20px 2px 2px',
      closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
      isHidden: false,
      alignBottom: true,
      pane: 'floatPane',
      enableEventPropagation: true
    });


    //'<form action="http://maps.google.com/maps" method="get" target="_blank" style="display:inline-block"">' +
    //  '<input name="saddr" value="" type="hidden">' +
    //  '<input type="hidden" name="daddr" value="' + item.Lat + ',' + item.Lng + '">' +
    //  '<button type="submit" value="Get directions" class="btn_infobox_get_directions">Directions</button>' + '</form>' +

    box.open(this.GmapVisible, context);
  }

  public HideAllMarkers() {
    this.CloseMapMark();
  }

  public test() {
    console.log(this.Criteria);
  }
}
