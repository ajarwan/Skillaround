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
  public ActivitiesPager: Pager = new Pager(1, 2, 0, 0);;


  public BookingIncludes: any[] = ['User'];

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

      this.ActivitiesPager = res.pager;
      let temp = res.d;
      temp.forEach((x: any, index: any) => {
        x.IsLoading = true;
        x.Pager = new Pager(1, 20, 0, 0);
        this.ActivitySVC.FindAllBookings({ ActivityId: x.Id }, x.Pager.PageIndex, x.Pager.PageSize, "CreateDate DESC", this.BookingIncludes.join(','), false).subscribe((innerRes: any) => {
          x.IsLoading = false;
          x.Pager = innerRes.pager;
          x.Bookings = innerRes.d;
          x.Bookings.forEach((y: any) => {
            y.StatusText = SharedService.GetBookingStatus(y.Status);
            y.ClassColor = SharedService.GetBookingStatusColor(y.Status);
          })
        })
      })

      this.Activities = this.Activities.concat(temp);


    });
  }


  public OnLoadMoreActivities() {
    this.ActivitiesPager.PageIndex += 1;
    this.LoadSupplierActivities();
  }
}
