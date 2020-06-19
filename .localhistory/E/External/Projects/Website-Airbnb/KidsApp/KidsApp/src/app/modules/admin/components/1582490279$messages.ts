import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import { ActivityService } from '../../activity/activity.service';
import { Pager } from 'src/app/shared/classes/Pager';

declare var $: any;

@Component({
  selector: 'admin-messages',
  templateUrl: './messages.html'
})
export class AdminMessages extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Pager: Pager = new Pager(1, 10, 0, 0);

  public Includes: any[] = [];

  public Msgs: any[] = [];

  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService,
    public ActivitySVC: ActivityService) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadData();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {

    this.AdminSVC.FindAllContactUsMessages(null, this.Pager.PageIndex, this.Pager.PageSize, null, this.Includes.join(''), false).subscribe((res: any) => {
      this.Msgs = res.d;
      this.Pager = res.pager;
    })
  }

  public SetSeen(msg: any) {
    msg.IsSeen = true;
    this.AdminSVC.
  }
   

}
