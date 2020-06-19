import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../../users/users.service';
import { User } from 'src/app/shared/Classes/User';



@Component({
  selector: 'suppliers-supplierinfo',
  templateUrl: './supplierinfo.html'
})
export class SupplierInfo extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public User: any = {};

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService) {
    super();

  }

  public ngOnInit() {

    this.userSVC.GetUserDetails().subscribe((res: any) => {
      if (!res)
        this.navigate('');

      this.User = res;
    });
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/


}
