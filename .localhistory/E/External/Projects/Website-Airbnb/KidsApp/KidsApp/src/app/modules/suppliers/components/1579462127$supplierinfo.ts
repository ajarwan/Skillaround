import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { User } from 'src/app/shared/Classes/User';
import { AppEnums } from 'src/app/app.enums';
import { Localization } from 'src/app/core/services/localization';


declare var $: any;
declare var MtrDatepicker: any;

@Component({
  selector: 'suppliers-supplierinfo',
  templateUrl: './supplierinfo.html'
})
export class SupplierInfo extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public User: any = {};
  public UserValidation: any = {};

  public WorkindDays: any[] = [
    { Id: -1, Title: 'Day' },
    { Id: AppEnums.Days.Sa, Title: Localization.Saturday },
    { Id: AppEnums.Days.Su, Title: Localization.Sunday },
    { Id: AppEnums.Days.Mo, Title: Localization.Monday },
    { Id: AppEnums.Days.Tu, Title: Localization.Tuesday },
    { Id: AppEnums.Days.We, Title: Localization.Wednesday },
    { Id: AppEnums.Days.Th, Title: Localization.Thursday },
    { Id: AppEnums.Days.Fr, Title: Localization.Friday },
  ]

  public SelectedStartDay = -1;
  public SelectedEndDay = -1;
  public SelectedStartTime: any;
  public SelectedEndTime: any;

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService) {
    super();

  }

  public ngOnInit() {


    this.LoadUserDetails();
   
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

  public LoadUserDetails() {
    this.userSVC.GetUserDetails().subscribe((res: any) => {
      if (!res)
        this.navigate('');

      this.User = res;

      this.SelectedStartDay = this.User.SupplierStatrtWorkingDay;
      this.SelectedEndDay = this.User.SupplierEndWorkingDay;
      //this.SelectedStartTime = new Date();
      //this.SelectedEndTime = new Date();

      this.InitTimePickers();
    });
  }
  public InitTimePickers() {

    let sconfig = {
      target: 'startTimePicker',
      smartHours: true,                // Make a smart switch from AM to PM
      animations: true,
    };

    let econfig = {
      target: 'endTimePicker',
      smartHours: true,                // Make a smart switch from AM to PM
      animations: true,
    };


    this.SelectedStartTime = new MtrDatepicker(sconfig);
    this.SelectedEndTime = new MtrDatepicker(econfig);
  }

}
