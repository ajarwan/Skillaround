import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/modules/users/users.service';
import { ActivityService } from 'src/app/modules/activity/activity.service';

@Component({
  selector: 'suppliers-supplieractivitieslist',
  templateUrl: './supplieractivitieslist.html'
})
export class SupplierActivitiesList extends BaseComponent implements OnInit, AfterViewInit {


  public Activities: any = [];
  public ActivityIncludes: any[] = ['Thumbnail'];

  public Pager: Pager = new Pager(1, 6, 0, 0);

  /******************************************
   * Properties
   * ***************************************/




  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySVC: ActivityService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', true);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.ActivitiesList);
    this.LoadSupplierActivities();


  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadSupplierActivities() {
    let criteria: any = {
      MyActivities: true,
      PostStatus: AppEnums.ActivityPostStatus.All
    }


    this.activitySVC.FindAllActivities(criteria, this.Pager.PageIndex, this.Pager.PageSize, 'CreateDate DESC', this.ActivityIncludes.join(','), true).subscribe((res: any) => {
      this.Activities = res.d;
      this.Pager = res.pager;

      this.Activities.forEach((x: any, index: any) => {
        this.activitySVC.FindActivityReviewStatistics(x.Id, false).subscribe((innerRes: any) => {
          if (innerRes) {
            x.TotalReviews = innerRes.TotalReviews;
            x.AvgRate = innerRes.AvgRate;
          }
        });

        //this.activitySVC.FindAllActivityDocuments(x.Id, false).subscribe((innerRes: any) => {
        //  if (innerRes) {
        //    x.Documents = innerRes.d;
        //  }


        //  if (index == this.Activities.length - 1) {
        //    this.RunSlick();
        //  }


        //});

      })

    });
  }

  public ToggleActivityPostStatus(activity: any) {
    activity.IsPosted = !activity.IsPosted;
    activity.IsLoading = true;
    this.activitySVC.UpdateActivity(activity, false).subscribe((res: any) => {
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
    this.LoadSupplierActivities();
  }

  public GoToDetails(activity: any) {
    this.navigate('supplier/activities/details/' + activity.Id )
  }
}
