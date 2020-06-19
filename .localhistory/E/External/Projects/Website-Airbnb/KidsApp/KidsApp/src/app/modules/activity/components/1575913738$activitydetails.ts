import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
import { Pager } from 'src/app/shared/classes/Pager';
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





  /*************************************
   *  Constructor
   *************************************/
  constructor(public activitySVC: ActivityService,
    public adminSVC: AdminService) {
    super();
  }

  public ngOnInit() {

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

}
