import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';


@Component({
  selector: 'suppliers-suppliers',
  templateUrl: './suppliers.html'
})
export class Suppliers extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Keyword: string = '';

  get IsSearchShown() {
    return DataStore.get('SupplierMasterSearchShown')
  }

  get PageTitle() {

    return DataStore.get('SupplierModulePageTitle');
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
  public OnSearch() {

    SharedSubjects.OnMasterSearch.next({
      Keyword: this.Keyword,
      Type: AppEnums.MasterSearch.SupplierActivitesSearch
    });
  }

  public ChangeLang() {
    if (environment.Lang == 'ar') {
      DataStore.addUpdate('Lang', 'en', CoreEnums.StorageLocation.LocalStorge);
    }
    else
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);

    location.reload();
  }


}
