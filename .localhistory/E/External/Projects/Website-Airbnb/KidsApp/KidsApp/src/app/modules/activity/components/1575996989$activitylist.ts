import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

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
    { Title: '6-9 yrs', Id: 2, AgeFrom: 6, AgeTo: 9 },
    { Title: '10-13 yrs', Id: 3, AgeFrom: 10, AgeTo: 13 },
    { Title: '14-16 yrs', Id: 4, AgeFrom: 14, AgeTo: 16 },
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
    });

    console.log('2');
    this.LoadCategories();
    this.LoadPriceRange();
    this.LoadActivities();
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
    })
  }

  public LoadPriceRange() {
    this.activitySVC.FindActivityPriceRange().subscribe((res: any) => {
      this.MinPrice = res.MinPrice;
      this.MaxPrice = res.MaxPrice;
      $("#price").val("$" + this.MinPrice + " - $" + this.MaxPrice);
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


  public OnFilterApply(type: FilterType) {

    switch (type) {
      case FilterType.Date:
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
    this.LoadActivities();
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

  public ToggleMap() {

    if (this.MapVisible)
      this.MapVisible = false;
    else
      this.MapVisible = true;

  }

  public test() {
    console.log(this.Criteria);
  }
}
