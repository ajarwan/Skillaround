import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { DataStore } from 'src/app/core/services/dataStrore.service';

@Component({
  selector: 'suppliers-supplieractivities',
  templateUrl: './supplieractivities.html'
})
export class SupplierActivities extends BaseComponent implements OnInit, AfterViewInit {






  /******************************************
   * Properties
   * ***************************************/




  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', true);



  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/


}
