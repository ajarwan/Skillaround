import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';

declare var $: any;

@Component({
  selector: 'suppliers-suppliers',
  templateUrl: './suppliers.html'
})
export class Suppliers extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  /******************************************
   * Properties
   * ***************************************/
  public Keyword: string = '';
  public IsSideBarOpen: boolean = false;

  get IsSearchShown() {
    return DataStore.get('SupplierMasterSearchShown')
  }

  get PageTitle() {

    return DataStore.get('SupplierModulePageTitle');
  }

  public DocumentClick = this.OnDomClick.bind(this);

  /*************************************
   *  Constructor
   *************************************/
  constructor(public smSVC: SocialMedialService) {
    super();

  }

  public ngOnInit() {
    console.log('------------------Suppliers Moduel------------------')

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Supplier);

    if (!this.ActiveUser || !this.ActiveUser.IsSupplier || this.ActiveUser.UserType == AppEnums.UserTypes.Manager)
      this.navigate('');

    document.addEventListener('click', this.DocumentClick);

  }

  public ngAfterViewInit() {
  }

  public ngOnDestroy() {
    document.removeEventListener('click', this.DocumentClick);
  }
  /*************************************
   *  Methods
   *************************************/
  //public OnSearch() {

  //  SharedSubjects.OnMasterSearch.next({
  //    Keyword: this.Keyword,
  //    Type: AppEnums.MasterSearch.SupplierActivitesSearch
  //  });
  //}

  public ChangeLang() {
    if (environment.Lang == 'ar') {
      DataStore.addUpdate('Lang', 'en', CoreEnums.StorageLocation.LocalStorge);
    }
    else
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);

    location.reload();
  }

  public ScrollUp() {
    $('html, body').animate({
      scrollTop: 0
    }, 1000);
  }

  public SignOut() {
    if (this.ActiveUser.LoginProvider == AppEnums.LoginProvider.Google) {
      if (!DataStore.get('GoogleInitialized')) {
        this.smSVC.gInitialize();
        setTimeout(() => {
          this.smSVC.gSignOut();
        }, 250)
      }
      else {
        this.smSVC.gSignOut();

      }
    }
    else if (this.ActiveUser.LoginProvider == AppEnums.LoginProvider.Facebook) {
      //this.smSVC.fbLogout();
    }

    DataStore.addUpdate('ActiveUser', null, CoreEnums.StorageLocation.LocalStorge);
    DataStore.addUpdate('token', null, CoreEnums.StorageLocation.LocalStorge);
    this.navigate('');
    location.reload();
  }

  public ToggleSideBar() {
    this.IsSideBarOpen = !this.IsSideBarOpen;
  }

  public OnDomClick() {
    this.IsSideBarOpen = false;
  }
}
