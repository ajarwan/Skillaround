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
import { SharedService } from 'src/app/shared/service/shared.service';
import { CoreEnums } from 'src/app/core/core.enums';
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


  public IsLoadingChart = false;
  public NODetailsStat = false;
  public NOListStat = false;

  /*************************************
  *  Constructor
  *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private sharedSVC: SharedService) {
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

    this.LoadSupplierViewStatistics();


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




  public LoadSupplierViewStatistics() {
    this.IsLoadingChart = true;
    this.sharedSVC.FindSupplierActivityViewStatistics(this.ActivityId, false).subscribe((res: any) => {
      //NODetailsStat
      //NOListStat
      this.IsLoadingChart = false;
      if (res) {
        this.DrawDetailsStatistics(res);

        //if (res.SystemUsersViewCount_Details + res.AnonymousUsersViewCount_Details > 0)
        //  this.DrawDetailsStatistics(res);
        //else
        //  this.NODetailsStat = true;

        if (res.SystemUsersViewCount_List + res.AnonymousUsersViewCount_List > 0)
          this.DrawListStatistics(res);
        else
          this.NOListStat = true;
      }
    })
  }

  public DrawDetailsStatistics(stat: any) {
    this.zone.runOutsideAngular(() => {

      //Draw Details Chart
      let chart = am4core.create("Chart_DetailsView", am4charts.PieChart);
      chart.logo.visible = false;
      chart.rtl = this.Language == CoreEnums.Lang.Ar ? true : false;
      chart.startAngle = 160;
      chart.endAngle = 380;
      // Let's cut a hole in our Pie chart the size of 40% the radius
      chart.innerRadius = am4core.percent(40);

      // Add data
      chart.data = [{
        "SystemUser": this.resources.SystemUser,
        "AnynoumousUser": this.resources.AnynoumousUser,
        "SystemUserCount": stat.SystemUsersViewCount_Details,
        "AnyCount": stat.AnonymousUsersViewCount_Details,
        "Total": stat.SystemUsersViewCount_Details + stat.AnonymousUsersViewCount_Details
      }];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "AnyCount";
      pieSeries.dataFields.category = "AnynoumousUser";
      pieSeries.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries.slices.template.strokeWidth = 1;
      pieSeries.slices.template.strokeOpacity = 1;

      //pieSeries.tooltip.tooltipText = "asdasd";

      // Disabling labels and ticks on inner circle
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      // Disable sliding out of slices
      pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
      pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
      pieSeries.radius = am4core.percent(40);
      pieSeries.innerRadius = am4core.percent(30);

      let cs = pieSeries.colors;
      cs.list = [am4core.color("#f6a721")];


      cs.stepOptions = {
        lightness: -0.05,
        hue: 0
      };
      cs.wrap = false;


      // Add second series
      let pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "SystemUserCount";
      pieSeries2.dataFields.category = "SystemUser";
      pieSeries2.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries2.slices.template.strokeWidth = 1;
      pieSeries2.slices.template.strokeOpacity = 1;
      pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0.05;
      pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;
      //pieSeries2.tooltip.tooltipText = "asdasd";
      pieSeries2.labels.template.disabled = true;
      pieSeries2.ticks.template.disabled = true;

      let label = chart.seriesContainer.createChild(am4core.Label);
      label.textAlign = "middle";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.adapter.add("text", (text, target) => {
        return `[font-size:18px]${this.resources.Total}[/]:\n[bold font-size:30px]` + chart.data[0].Total + "[/]";
      })

      let title = chart.titles.create();
      title.text = this.resources.DetailsViewStatistics;
      title.fontSize = 25;
      title.marginBottom = 0;
      title.marginTop = 10;

    });
  }

  public DrawListStatistics(stat: any) {

    this.zone.runOutsideAngular(() => {

      //Draw Details Chart
      let chart = am4core.create("Chart_ListView", am4charts.PieChart);
      chart.logo.visible = false;
      chart.rtl = this.Language == CoreEnums.Lang.Ar ? true : false;
      chart.startAngle = 160;
      chart.endAngle = 380;
      // Let's cut a hole in our Pie chart the size of 40% the radius
      chart.innerRadius = am4core.percent(40);

      // Add data
      chart.data = [{
        "SystemUser": this.resources.SystemUser,
        "AnynoumousUser": this.resources.AnynoumousUser,
        "SystemUserCount": stat.SystemUsersViewCount_List,
        "AnyCount": stat.AnonymousUsersViewCount_List,
        "Total": stat.SystemUsersViewCount_List + stat.AnonymousUsersViewCount_List
      }];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "AnyCount";
      pieSeries.dataFields.category = "AnynoumousUser";
      pieSeries.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries.slices.template.strokeWidth = 1;
      pieSeries.slices.template.strokeOpacity = 1;

      //pieSeries.tooltip.tooltipText = "asdasd";

      // Disabling labels and ticks on inner circle
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;

      // Disable sliding out of slices
      pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
      pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
      pieSeries.radius = am4core.percent(40);
      pieSeries.innerRadius = am4core.percent(30);

      let cs = pieSeries.colors;
      cs.list = [am4core.color("#f6a721")];

      cs.stepOptions = {
        lightness: -0.05,
        hue: 0
      };
      cs.wrap = false;


      // Add second series
      let pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "SystemUserCount";
      pieSeries2.dataFields.category = "SystemUser";
      pieSeries2.slices.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      pieSeries2.slices.template.strokeWidth = 1;
      pieSeries2.slices.template.strokeOpacity = 1;
      pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0.05;
      pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;
      //pieSeries2.tooltip.tooltipText = "asdasd";
      pieSeries2.labels.template.disabled = true;
      pieSeries2.ticks.template.disabled = true;


      let label = chart.seriesContainer.createChild(am4core.Label);
      label.textAlign = "middle";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.adapter.add("text", (text, target) => {
        return `[font-size:18px]${this.resources.Total}[/]:\n[bold font-size:30px]` + chart.data[0].Total + "[/]";
      })

      let title = chart.titles.create();
      title.text = this.resources.ListViewStatistics;
      title.fontSize = 25;
      title.marginBottom = 0;
      title.marginTop = 10;


    });



  }


}
