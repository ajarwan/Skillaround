import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { SocialMedialService } from 'src/app/services/socialMedia.Service';
import { AdminService } from '../admin.service';

declare var $: any;

@Component({
  selector: 'admin-admin',
  templateUrl: './admin.html'
})
export class Admin extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public MessagesCount: any;
  /*************************************
   *  Constructor
   *************************************/
  constructor(public smSVC: SocialMedialService,
    public AdminSVC: AdminService) {
    super();

  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');
    else {
      this.LoadMessagesCount()
    }
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

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

  public LoadMessagesCount() {
    this.AdminSVC.FindContacUsMessagesCount().subscribe((res: any) => {
      this.MessagesCount = res;
    })
  }
}
