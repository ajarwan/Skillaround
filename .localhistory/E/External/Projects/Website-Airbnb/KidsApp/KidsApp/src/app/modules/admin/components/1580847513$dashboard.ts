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
  public Counts: any = {
    IsLoading: true
  }


  public ActivityInclude: any = ['Category'];
  public Activites: any = {
    IsLoading: true
  }
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
    this.AdminSVC.FindDashboardCounts(false).subscribe((res: any) => {
      this.Counts = res;
    })

    this.ActivitySVC.FindAllActivities(null, 1, 6, "CreateDate DESC", this.ActivityInclude.join(','), false).subscribe((res: any) => {
      this.Activites = res.d;
    });
  }

}
