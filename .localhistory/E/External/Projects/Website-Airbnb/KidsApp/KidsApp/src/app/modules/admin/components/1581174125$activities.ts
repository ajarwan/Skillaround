import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'admin-activities',
  templateUrl: './activities.html'
})
export class AdminActivities extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Activities: any[] = [];

  public Pager: Pager = new Pager(1, 6, 0, 0);

  public ActivityIncludes: any[] = ['Thumbnail','Supplier'];

  public IsLoading: boolean = false;

  /*************************************
   *  Constructor
   *************************************/
  constructor(public ActivitySVC: ActivityService) {
    super();

  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadActivities();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadActivities() {

    this.IsLoading = true;

    this.ActivitySVC.FindAllActivities({}, this.Pager.PageIndex, this.Pager.PageSize, "CreateDate DESC",
      this.ActivityIncludes.join(','), false).subscribe((res: any) => {

        this.IsLoading = false;
        this.Activities = res.d;
        this.Pager = res.pager;

        this.Activities.forEach((x: any, index: any) => {
          this.ActivitySVC.FindActivityReviewStatistics(x.Id, false).subscribe((innerRes: any) => {
            if (innerRes) {
              x.TotalReviews = innerRes.TotalReviews;
              x.AvgRate = innerRes.AvgRate;
            }
          });
        });
      });
  }

  public ToggleActivityPostStatus(activity: any) {
    activity.IsPosted = !activity.IsPosted;
    activity.IsLoading = true;
    this.ActivitySVC.UpdateActivity(activity, false).subscribe((res: any) => {
      activity.IsLoading = false;
    }, (err: any) => {
      activity.IsLoading = false;
      activity.IsPosted = !activity.IsPosted;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    })
  }

  public OnPageChange(pageIndex: number) {
    this.Pager.PageIndex = pageIndex;
    this.LoadActivities();
  }

}
