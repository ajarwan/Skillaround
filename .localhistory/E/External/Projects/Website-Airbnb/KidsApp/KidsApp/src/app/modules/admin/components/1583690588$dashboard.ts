import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import { ActivityService } from '../../activity/activity.service';

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
  };
  public Counts: any = []

  public MostRatedSuppliers: any = []


  public ActivityInclude: any = ['Category'];
  public Activites: any = []
  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService,
    public ActivitySVC: ActivityService) {
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
  }

}
