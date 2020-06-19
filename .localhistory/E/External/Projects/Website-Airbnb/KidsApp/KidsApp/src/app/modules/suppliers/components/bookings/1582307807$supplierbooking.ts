import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { AppEnums } from 'src/app/app.enums';
import Swal from 'sweetalert2';

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
        x.Pager = new Pager(1, 20, 0, 0);
        this.LoadActivityBookings(x);
      })

      this.Activities = this.Activities.concat(temp);


    });
  }


  public OnLoadMoreActivities() {
    this.ActivitiesPager.PageIndex += 1;
    this.LoadSupplierActivities();
  }

  public OnLoadMoreBookings(activity: any) {
    activity.Pager.PageIndex += 1;
    this.LoadActivityBookings(activity);
  }

  public LoadActivityBookings(activity: any) {
    activity.IsLoading = true;
    this.ActivitySVC.FindAllBookings({ ActivityId: activity.Id }, activity.Pager.PageIndex, activity.Pager.PageSize, "CreateDate DESC", this.BookingIncludes.join(','), false).subscribe((innerRes: any) => {
      activity.IsLoading = false;
      activity.Pager = innerRes.pager;
      let bookings = innerRes.d;
      bookings.forEach((y: any) => {
        y.StatusText = SharedService.GetBookingStatus(y.Status);
        y.ClassColor = SharedService.GetBookingStatusColor(y.Status);
      })

      if (!activity.Bookings)
        activity.Bookings = [];

      activity.Bookings = activity.Bookings.concat(bookings)
    })
  }

  public SetBookingStatus(booking: any, status: AppEnums.BookingConfirmationStatus) {
    let temp = booking.Status;

    Swal.fire({
      icon: 'question',
      text: this.resources.AryYouSure,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.resources.GeneralYes,
      cancelButtonText: this.resources.GeneralNo
    }).then((res: any) => {
      if (res.value) {
        booking.IsLoading = true;
        booking.Status = status;
        this.ActivitySVC.UpdateBooking(booking).subscribe((res: any) => {
          booking.StatusText = SharedService.GetBookingStatus(res.Status);
          booking.ClassColor = SharedService.GetBookingStatusColor(res.Status);
          this.OnUpdateStatusSuccess(booking)

        }, (err: any) => { this.OnUpdateStatusError(booking, temp) })
      }
    })
  }

  public OnUpdateStatusSuccess(booking: any) {
    booking.IsLoading = false;

    Swal.fire({
      icon: 'success',
      text: this.resources.SubmitSuccessfully,
      timer: 5000,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    });
  }
  public OnUpdateStatusError(booking: any, status: any) {

    booking.Status = status;
    booking.IsLoading = false;

    Swal.fire({
      icon: 'error',
      text: this.resources.ErrorInSystem,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    });
  }

}
