import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import Swal from 'sweetalert2';

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
  constructor() {
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
