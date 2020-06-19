import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html'
})
export class Privacy extends BaseComponent implements OnInit {


  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }

  public ngOnInit() {
  }






}
