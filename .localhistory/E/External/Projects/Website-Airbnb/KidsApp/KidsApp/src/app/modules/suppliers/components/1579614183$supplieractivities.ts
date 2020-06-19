import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';

@Component({
  selector: 'suppliers-supplieractivities',
  templateUrl: './supplieractivities.html'
})
export class SupplierActivities extends BaseComponent implements OnInit, AfterViewInit {


  public Activities: any = [];

  public Pager: Pager = new Pager(1, 6, 0, 0);

  /******************************************
   * Properties
   * ***************************************/




  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', true);

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


    this.activitySCV.FindAllActivities(criteria, this.Pager.PageIndex, this.Pager.PageSize, 'CreateDate DESC', null, true).subscribe((res: any) => {
      this.Activities = es.d;
      this.Pager = res.pager;
    });
  }

}
