import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Validator } from 'src/app/core/services/validator';
import Swal from 'sweetalert2';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../users/users.service';
declare var $: any;

enum FilterType {
  Date = 1,
  Category = 2,
  Price = 3,
  Age = 4,
  Transportation = 5
}

enum Day {
  Start = 1,
  End = 2
}
@Component({
  selector: 'activity-details',
  templateUrl: './activitydetails.html'
})
export class ActivityDetails extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public ActivityId: number = null;
  public ActivityInclude: any[] = ['Category', 'Supplier'];
  public Activity: any = {};
  public ActivityDocuments: any[] = null;
  public CheckCount: number = 0;
  public Msg: string = '';
  public IsLoadingCapacity: boolean = false;
  public ShowMsg: boolean = false;


  public ReviewsStat: any = {};
  public ReviewsPager: Pager = new Pager(1, 5, 0, 0);
  public ReviewsInclude: any[] = ['User'];
  public Reviews: any[] = [];
  public ReviewValidations: any = {};

  public NewReview: any = {};

  public Day = Day;
  public CountErrorMsg = false;

  public IsConnectShown = false;

  public get FromDateFormatted() {
    if (!this.Activity)
      return '';

    return this.formatDate(new Date(this.Activity.From), 'mmm dd, yyyy');
  }

  public get ToDateFormatted() {
    if (!this.Activity)
      return '';

    return this.formatDate(new Date(this.Activity.To), 'mmm dd, yyyy');
  }

  @ViewChild('BookingTemplate', null) BookingTemplate: any;
  public modalOptions: NgbModalOptions;

  /*************************************
   *  Constructor
   *************************************/
  constructor(public activitySVC: ActivityService,
    public adminSVC: AdminService,
    public usersSVC: UsersService,
    private route: ActivatedRoute,
    private sharedSVC: SharedService,
    public modalService: NgbModal) {
    super();
    this.modalOptions = {
      backdrop: 'static',
      size: 'lg',
      centered: true
    }
  }

  public ngOnInit() {

    this.ActivityId = this.route.snapshot.params['id'];

    this.LoadActivityDetails();
    this.LoadActivityDocuments();
    this.LoadReviewData();


  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadActivityDetails() {
    this.activitySVC.FindActivityById(this.ActivityId, this.ActivityInclude.join(',')).subscribe((res: any) => {
      this.Activity = res;

      if (this.ActiveUser)
        this.CheckUserConnection();
    })
  }

  public LoadReviewData() {
    this.LoadReviewsStatistics();
    this.LoadReviews();
  }

  public LoadActivityDocuments() {
    this.activitySVC.FindAllActivityDocuments(this.ActivityId, false).subscribe((res: any) => {
      this.ActivityDocuments = res.d;
    })
  }

  public LoadReviewsStatistics() {

    this.activitySVC.FindActivityReviewStatistics(this.ActivityId).subscribe((res: any) => {
      this.ReviewsStat = res;
    })
  }

  public LoadReviews() {
    this.activitySVC.FindAllReviews({ ActivityId: this.ActivityId }, this.ReviewsPager.PageIndex, this.ReviewsPager.PageSize, "Id DESC", this.ReviewsInclude.join(','), false).subscribe((res: any) => {
      this.Reviews = res.d;
      this.ReviewsPager = res.pager;
    })
  }

  public ShowOnMap() {
    window.open('https://www.google.com/maps/dir//' + this.Activity.Lat + ',' + this.Activity.Lng, '_blank');
  }

  public IncrementCheckCont() {

    if (this.CheckCount == 10)
      return;

    this.CountErrorMsg = false;
    this.BookingCountValidation = false;
    this.CheckCount += 1;
  }

  public DecrementCheckCont() {

    if (this.CheckCount == 0)
      return;

    this.CountErrorMsg = false;
    this.BookingCountValidation = false;
    this.CheckCount -= 1;
  }

  public CheckAvailableCount() {

    if (this.CheckCount == 0) {
      this.CountErrorMsg = true;
      return;
    }
    this.CountErrorMsg = false;
    this.IsLoadingCapacity = true;
    this.ShowMsg = false;
    this.activitySVC.CheckActivityAvailability(this.ActivityId, this.CheckCount, false).subscribe((res: any) => {
      setTimeout(() => {
        this.IsLoadingCapacity = false;
        this.ShowMsg = true;
        if (res) {
          this.Msg = this.resources.YesAvailable;
        }
        else {
          //res = 0
          this.Msg = this.resources.NoAvailable;
        }
      }, 1000)

    });
  }

  public getDayName(day: Day) {
    if (day == Day.Start) {
      return this.sharedSVC.GetDayName(this.Activity.Supplier.SupplierStatrtWorkingDay)
    }
    else {
      return this.sharedSVC.GetDayName(this.Activity.Supplier.SupplierEndWorkingDay)
    }
  }

  public AddNewReview() {
    this.ReviewValidations = {};

    if (!this.NewReview.Rate) {
      this.ReviewValidations.Rate = true;
    }

    if (Validator.StringIsNullOrEmpty(this.NewReview.Text)) {
      this.ReviewValidations.Text = true;
    }

    if (this.ReviewValidations.Text || this.ReviewValidations.Rate)
      return;

    this.NewReview.UserId = this.ActiveUser.Id;
    this.NewReview.ActivityId = this.ActivityId;

    this.activitySVC.AddReview(this.NewReview).subscribe((res: any) => {

      Swal.fire({
        icon: 'success',
        text: this.resources.SubmitSuccessfully,
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });

      this.NewReview = {};
      this.LoadReviewData();
      //res.User = this.ActiveUser;
      //this.Reviews.push(res);
    })
  }

  public OnBookingNow() {
    if (!this.ActiveUser) {
      SharedSubjects.OpenLoginPopup.next();
    }
    else {

      this.modalService.open(this.BookingTemplate, this.modalOptions).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  public OnCancelBooking() {
    this.CheckCount = 0;
    this.BookingCountValidation = false;
    this.modalService.dismissAll();
  }

  public BookingCountValidation = false;
  public IsLoadingBooking = false;
  public BookingCountNotAvailable = false;

  public OnBook() {
    this.BookingCountNotAvailable = false;
    if (this.CheckCount == 0) {
      this.BookingCountValidation = true;
      return;
    }

    this.IsLoadingBooking = true;

    let Booking: any = {
      UserId: this.ActiveUser.Id,
      ActivityId: this.ActivityId,
      Activity: {
        Id: this.ActivityId,
        TitleAr: this.Activity.TitleAr,
        TitleEn: this.Activity.TitleEn,
        LocationName: this.Activity.LocationName,
        Category: this.Activity.Category,
        Supplier: {
          Id: this.Activity.Supplier.Id,
          FirstName: this.Activity.Supplier.FirstName,
          LastName: this.Activity.Supplier.LastName,
          PhoneNumber: this.Activity.Supplier.PhoneNumber,
          Email: this.Activity.Supplier.Email
        }
      },
      User: {
        Id: this.ActiveUser.Id,
        Email: this.ActiveUser.Email,
        FirstName: this.ActiveUser.FirstName,
        LastName: this.ActiveUser.LastName,
        PhoneNumber: this.ActiveUser.PhoneNumber,
      },
      Count: this.CheckCount
    }

    this.activitySVC.AddBooking(Booking, false).subscribe((res: any) => {
      this.IsLoadingBooking = false;
      if (res) {
        this.OnBookingSuccess();
        this.OnCancelBooking();
      }
      else {
        this.BookingCountNotAvailable = true;
      }
    }, (err: any) => { this.OnBookingError() });


  }

  public OnBookingSuccess() {

    Swal.fire({
      icon: 'success',
      text: this.resources.BookedSuccessfully,
      timer: 5000,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    });


  }

  public OnBookingError() {
    this.IsLoadingBooking = false;
    Swal.fire({
      icon: 'error',
      text: this.resources.ErrorInSystem,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    });
  }

  public CheckUserConnection() {
    this.usersSVC.IsConnected(this.Activity.SupplierId).subscribe((res: any) => {
      if (res)
        this.IsConnectShown = false;
      else
        this.IsConnectShown = true;

    })
  }

  public OnConnect() {
    this.is
  }

}


