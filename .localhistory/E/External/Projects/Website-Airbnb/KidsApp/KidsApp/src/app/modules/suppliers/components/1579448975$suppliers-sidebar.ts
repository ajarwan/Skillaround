import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { AppEnums } from 'src/app/app.enums';


@Component({
  selector: 'suppliers-sidebar',
  templateUrl: './suppliers-sidebar.html'
})
export class SuppliersSideBar extends BaseComponent implements OnInit, AfterViewInit {

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
