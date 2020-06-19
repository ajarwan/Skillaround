import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';
  
@Component({
  selector: 'app-footer',
  templateUrl: './appfooter.html'
})
export class AppFooter extends BaseComponent {

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }


  public ScrollUp() {
    $('html, body').animate({
      scrollTop: 0
    }, 1000);
  }

}
