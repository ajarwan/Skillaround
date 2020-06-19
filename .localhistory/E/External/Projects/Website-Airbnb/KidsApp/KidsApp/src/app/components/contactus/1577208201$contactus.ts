import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';
import { Validator } from 'src/app/core/services/validator';

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
    Messgae: ''
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

    if (!this.ActiveUser) {

      if (Validator.StringIsNullOrEmpty(this.Msg.Name)) {
        this.Validations.Name = true;
      }

      if (Validator.StringIsNullOrEmpty(this.Msg.Email)) {
        this.Validations.Email = true;
      }

    }


    if (Validator.StringIsNullOrEmpty(this.Msg.Messgae)) {
      this.Validations.Messgae = true;
    }

    if (Object.getOwnPropertyNames(this.Validations).length > 0)
      return;


    this.



  }




}
