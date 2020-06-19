import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';


@Component({
  selector: 'suppliers-suppliers',
  templateUrl: './suppliers.html'
})
export class Suppliers extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  IsSearchShown() {
    return DataStore.get('SupplierMasterSearchShown')
  }

  /*************************************
   *  Constructor
   *************************************/
  constructor() {
    super();

  }

  public ngOnInit() {
    console.log('------------------Suppliers Moduel------------------')

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Supplier);

    if (!this.ActiveUser || !this.ActiveUser.IsSupplier)
      this.navigate('');
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/


}
