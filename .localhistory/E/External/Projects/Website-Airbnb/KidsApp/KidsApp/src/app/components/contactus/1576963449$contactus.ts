import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.html'
})
export class ContactUs extends BaseComponent {

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }




}
