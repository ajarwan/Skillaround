import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './about.html'
})
export class TermsAndConditions extends BaseComponent implements OnInit {


  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }

  public ngOnInit() {
  }






}
