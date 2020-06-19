import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { AppEnums } from 'src/app/app.enums';

declare var $: any;
declare var MtrDatepicker: any;

@Component({
  selector: 'suppliers-supplierbooking',
  templateUrl: './supplierbooking.html'
})
export class SupplierBooking extends BaseComponent implements OnInit, AfterViewInit {


  /******************************************
   * Properties
   * ***************************************/
  public ActivityCriteria: any = {
    MyActivities: true,
    PostStatus: AppEnums.ActivityPostStatus.All
  };
  public IsLoadingActivities: boolean = false;
  public Activities: any[] = [];
  public ActivitiesPager: Pager = new Pager(1, 10, 0, 0);;

  public Booking: any[] = [];
  public BookingsPager: Pager = new Pager(1, 10, 0, 0);

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private ActivitySVC: ActivityService,
    private sharedSVC: SharedService) {
    super();

  }

  public ngOnInit() {
    this.LoadSupplierActivities()
  }

  public ngAfterViewInit() {

  }

  /*************************************
   *  Methods
   *************************************/
  public LoadSupplierActivities() {
    this.IsLoadingActivities = true;
    this.ActivitySVC.FindAllActivities(this.ActivityCriteria, this.ActivitiesPager.PageIndex, this.ActivitiesPager.PageSize, 'CreateDate DESC', null, false).subscribe((res: any) => {
      this.IsLoadingActivities = false;
      this.Activities = res.d;
      this.ActivitiesPager = res.pager;

      this.Activities.forEach((x: any, index: any) => {

      })

    });
  }
}
