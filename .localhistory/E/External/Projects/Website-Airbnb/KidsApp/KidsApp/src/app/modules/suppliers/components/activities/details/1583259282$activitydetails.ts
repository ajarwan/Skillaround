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

    this.LoadSupplierViewStatistics()
    this.zone.runOutsideAngular(() => {

      let chart = am4core.create("chartdiv1", am4charts.PieChart);
      chart.startAngle = 160;
      chart.endAngle = 380;

      // Let's cut a hole in our Pie chart the size of 40% the radius
      chart.innerRadius = am4core.percent(40);

      // Add data
      chart.data = [{
        "SystemUser": "System User",
        "Any": "Anynoumous",
        "SystemUserCount": 501.9,
        "AnyCount": 1500,
        "total": 1220
      }];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "SystemUserCount";
      pieSeries.dataFields.category = "SystemUser";
      pieSeries.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries.slices.template.strokeWidth = 1;
      pieSeries.slices.template.strokeOpacity = 1;

      // Disabling labels and ticks on inner circle
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      // Disable sliding out of slices
      pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
      pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
      pieSeries.radius = am4core.percent(40);
      pieSeries.innerRadius = am4core.percent(30);

      let cs = pieSeries.colors;
      cs.list = [am4core.color(new am4core.ColorSet().getIndex(0))];

      cs.stepOptions = {
        lightness: -0.05,
        hue: 0
      };
      cs.wrap = false;


      // Add second series
      let pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "AnyCount";
      pieSeries2.dataFields.category = "Any";
      pieSeries2.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries2.slices.template.strokeWidth = 1;
      pieSeries2.slices.template.strokeOpacity = 1;
      pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0.05;
      pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;

      pieSeries2.labels.template.disabled = true;
      pieSeries2.ticks.template.disabled = true;


      let label = chart.seriesContainer.createChild(am4core.Label);
      label.textAlign = "middle";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.adapter.add("text", function (text, target) {
        return "[font-size:18px]total[/]:\n[bold font-size:30px]" + pieSeries.dataItem.values.value.sum + "[/]";
      })


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

  public LoadSupplierViewStatistics() {
    //this.IsLoadingChart = true;
  }
}
