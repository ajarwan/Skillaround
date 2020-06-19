import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';



@Component({
  selector: 'suppliers-supplierinfo',
  templateUrl: './supplierinfo.html'
})
export class SupplierInfo extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/


  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC:UsersService) {
    super();

  }

  public ngOnInit() {

    this.userSVC.
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/


}
