import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { document } from 'ngx-bootstrap';
declare var $: any;

enum FilterType {
  Date = 1,
  Category = 2,
  Price = 3,
  Age = 4,
  Transportation = 5
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
  public ActivityInclude: any[] = ['Category'];
  public Activity: any = {};
  public ActivityDocuments: any[] = [];
  public CheckCount: number = 0;
  public Msg: string = '';
  public IsLoadingCapacity: boolean = false;
  public ShowMsg: boolean = false;

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
  /*************************************
   *  Constructor
   *************************************/
  constructor(public activitySVC: ActivityService,
    public adminSVC: AdminService,
    private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {

    this.ActivityId = this.route.snapshot.params['id'];

    this.LoadActivityDetails();
    this.LoadActivityDocuments();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadActivityDetails() {
    this.activitySVC.FindActivityById(this.ActivityId, this.ActivityInclude.join(',')).subscribe((res: any) => {
      this.Activity = res;
    })
  }

  public LoadActivityDocuments() {
    this.activitySVC.FindAllActivityDocuments(this.ActivityId, false).subscribe((res: any) => {
      this.ActivityDocuments = res.d;
    })
  }

  public ShowOnMap() {
    window.open('https://www.google.com/maps/dir//' + this.Activity.Lat + ',' + this.Activity.Lng, '_blank');
  }

  public IncrementCheckCont() {
    if (this.CheckCount == 10)
      return;
    this.CheckCount += 1;
  }

  public DecrementCheckCont() {
    if (this.CheckCount == 0)
      return;

    this.CheckCount -= 1;
  }

  public CheckAvailableCount() {
    this.IsLoadingCapacity = true;
    this.ShowMsg = false;
    this.activitySVC.FindAvailableCapacityCount(this.ActivityId, false).subscribe((res: any) => {
      this.IsLoadingCapacity = false;
      this.ShowMsg = true;
      if (res) {
        if (res >= this.CheckCount) {
          this.Msg = res.YesAvailable;
        }
        else {
          this.Msg = res.NoAvailable + res;
        }
      }
      else {
        //res = 0
      }
    });
  }
}
