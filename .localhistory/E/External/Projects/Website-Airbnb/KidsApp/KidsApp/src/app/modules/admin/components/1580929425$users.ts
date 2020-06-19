import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { UsersService } from '../../users/users.service';
import { Pager } from 'src/app/shared/classes/Pager';

declare var $: any;

@Component({
  selector: 'admin-users',
  templateUrl: './users.html'
})
export class AdminUsers extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Pager: Pager = new Pager(1, 9, 0, 0);

  public Users: any = [];

  /*************************************
   *  Constructor
   *************************************/
  constructor(public UsersSVC: UsersService) {
    super();

  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadUsers();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUsers() {
    this.UsersSVC.FindAllUsers({}, this.Pager.PageIndex, this.Pager.PageSize, null, null, false).subscribe((res: any) => {
      this.Users = res.d;
      this.Pager = res.pager;
    })
  }

}
