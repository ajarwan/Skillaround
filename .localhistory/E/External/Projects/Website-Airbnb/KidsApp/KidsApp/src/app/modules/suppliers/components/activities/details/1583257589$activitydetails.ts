import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
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

 
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

declare var $: any;
declare var google: any;

@Component({
  selector: 'suppliers-activitydetails',
  templateUrl: './activitydetails.html'
})
export class ActivityDetails extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
  * Properties
  * ***************************************/
  public ActivityId: number = null;
  public Activity: any = {};
  public ActivityIncludes: any[] = ['Category'];


  public IsLoading: boolean = false;
  public IsLoadingImages: boolean = false;

  public ReviewsPager: Pager = new Pager(1, 6, 0, 0);
  public ReviewsInclude: any[] = ['User'];
  public IsLoadingReviews = false;
  public Reviews: any[] = [];


  private chart: am4charts.XYChart;
  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService,
    private route: ActivatedRoute,
    private zone: NgZone) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.ActivityDetails);

    this.ActivityId = this.route.snapshot.params['id'];
    if (this.ActivityId) {
      this.LoadActivityDetails();
      this.LoadActivityReviews();
    }

    else
      this.navigate('supplier/activities');
  }

  public ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;

      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }

      chart.data = data;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    }); 

  }

  /*************************************
   *  Methods
   *************************************/
  public LoadActivityDetails() {
    this.IsLoading = true;
    this.activitySCV.FindActivityById(this.ActivityId, this.ActivityIncludes.join(','), false).subscribe((res: any) => {
      if (!res || res.SupplierId != this.ActiveUser.Id)
        this.navigate('supplier/activities');

      this.Activity = res;
      this.IsLoading = false;

      this.IsLoadingImages = true;
      this.activitySCV.FindAllActivityDocuments(this.ActivityId, false).subscribe((res: any) => {
        this.IsLoadingImages = false;
        this.Activity.Documents = res.d;

      }, (err: any) => {
        this.IsLoadingImages = false;
      });

    }, (err: any) => {
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((respones: any) => {
        this.navigate('supplier/activities');
      })
    });

  }

  public LoadActivityReviews() {
    this.activitySCV.FindAllReviews({ ActivityId: this.ActivityId }, this.ReviewsPager.PageIndex, this.ReviewsPager.PageSize
      , 'CreateDate DESC', this.ReviewsInclude.join(','), false).subscribe((res: any) => {
        this.ReviewsPager = res.pager;

        this.Reviews = this.Reviews.concat(res.d);

        this.IsLoadingReviews = false;
      })
  }

  public LoadMoreReviews() {
    this.IsLoadingReviews = true;

    setTimeout(() => {
      this.ReviewsPager.PageIndex += 1;
      this.LoadActivityReviews();
    }, 100)


  }

  public OnTogglePostStatus() {
    this.Activity.IsPosted = !this.Activity.IsPosted;

    this.IsLoading = true;
    this.activitySCV.UpdateActivity(this.Activity, false).subscribe((res: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'success',
        text: this.Activity.IsPosted ? this.resources.PublishedSuccessfully : this.resources.UnPublishedSuccessfully,
        showConfirmButton: true,
        confirmButtonText: this.resources.Acknowldge
      })

    }, (err: any) => {
      this.Activity.IsPosted = !this.Activity.IsPosted;
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      })
    })

  }

  public GoToActivityEditPage() {
    this.navigate('supplier/activities/edit/' + this.ActivityId);
  }

  public IsReadMoreButtonShown(ele: any) {

    if ($(ele)[0].offsetHeight >= 100)
      return true;

    return false;
  }

  public ReadMoreReviews(ele: any, btn: any) {

    $(btn).css("display", "none");

    setTimeout(() => {
      $(ele).css("max-height", "100%");
    }, 100)
  }




  public IsLoadingChart = false;
}
