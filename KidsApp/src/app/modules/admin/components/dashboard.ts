import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import { ActivityService } from '../../activity/activity.service';
import { SharedService } from 'src/app/shared/service/shared.service';

declare var $: any;

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.html'
})
export class AdminDashboard extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/

  public Loadings = {
    Counts: false,
    Suppliers: false,
    Activities: false,
    MostActiveUsers: false,
    MostViewedActivities: false
  };
  public Counts: any = []

  public MostRatedSuppliers: any = []


  public ActivityInclude: any = ['Category'];
  public Activites: any = [];

  public MostActiveUsers: any = [];
  public MostViewedActivities: any = [];
  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService,
    public ActivitySVC: ActivityService,
    public SharedSVC: SharedService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadData()
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {
    this.Loadings.Counts = true;
    this.AdminSVC.FindDashboardCounts(false).subscribe((res: any) => {
      this.Loadings.Counts = false;
      this.Counts = res;
    })

    this.Loadings.Activities = true;
    this.ActivitySVC.FindAllActivities(null, 1, 6, "CreateDate DESC", this.ActivityInclude.join(','), false).subscribe((res: any) => {
      this.Loadings.Activities = false;
      this.Activites = res.d;

      this.Activites.forEach((x: any) => {
        if (x.From) {
          x.DisplayFromDate = this.formatDate(new Date(x.From), 'dd/MM/yyyy');
        }
        else {
          x.DisplayFromDate = '-----';
        }

        if (x.To) {
          x.DisplayToDate = this.formatDate(new Date(x.To), 'dd/MM/yyyy');
        }
        else {
          x.DisplayToDate = '-----';
        }
      });
    });

    this.Loadings.Suppliers = true;
    this.AdminSVC.FindMostRatedSuppliers(false).subscribe((res: any) => {
      this.Loadings.Suppliers = false;
      this.MostRatedSuppliers = res;
    })

    this.Loadings.MostActiveUsers = true;
    this.SharedSVC.FindMostActiveUsers(false).subscribe((res: any) => {
      this.MostActiveUsers = res;
      this.Loadings.MostActiveUsers = false;
    });


    this.Loadings.MostViewedActivities = true;
    this.SharedSVC.FindMostViewedActivities(false).subscribe((res: any) => {
      this.MostViewedActivities = res;
      this.Loadings.MostViewedActivities = false;

      this.MostViewedActivities.forEach((x: any) => {
        if (x.Activity.From) {
          x.Activity.DisplayFromDate = this.formatDate(new Date(x.Activity.From), 'dd/MM/yyyy');
        }
        else {
          x.Activity.DisplayFromDate = '-----';
        }

        if (x.Activity.To) {
          x.Activity.DisplayToDate = this.formatDate(new Date(x.Activity.To), 'dd/MM/yyyy');
        }
        else {
          x.Activity.DisplayToDate = '-----';
        }
      });
    });

  }

}
