import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'suppliers-addeditactivity',
  templateUrl: './addeditactivity.html'
})
export class AddEditActivity extends BaseComponent implements OnInit, AfterViewInit {

  public Activity: any = {};
  public Validations: any = {};

  public Categories: any[] = [];
  public Ages: any[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  /******************************************
   * Properties
   * ***************************************/




  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.AddActivity);

    this.LoadCategories();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadCategories() {
    this.adminSVC.FindAllCategories(null, null, null, "Id ASC").subscribe((res: any) => {
      this.Categories = res.d;
    })
  }
}
