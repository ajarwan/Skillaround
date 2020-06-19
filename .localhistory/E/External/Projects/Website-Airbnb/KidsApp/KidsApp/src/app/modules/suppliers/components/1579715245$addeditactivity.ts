import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';

@Component({
  selector: 'suppliers-addeditactivity',
  templateUrl: './addeditactivity.html'
})
export class AddEditActivity extends BaseComponent implements OnInit, AfterViewInit {



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

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.ActivitiesList);


  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

}
