import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.html'
})
export class ContactUs extends BaseComponent {


  public Msg: any = {
    FromUserId: this.ActiveUser ? this.ActiveUser.Id : null,
    Name: this.ActiveUser ? this.ActiveUser.FullName : '',
    Email: this.ActiveUser ? this.ActiveUser.Email : '',
    MobileNumber: '',
  };

  public Validations: any = {};

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }


  public SendMessgae() {
    this.Validations = {};
    h
  }




}
