import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-footer',
  templateUrl: './appfooter.html'
})
export class AppFooter extends BaseComponent implements OnInit {

  public CopyRights = '';

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }


  public ngOnInit() {
    this.CopyRights = this.resources.CopyRights.replace('{{year}}', this.formatDate(new Date(), 'yyyy'))
  }

  public ScrollUp() {
    $('html, body').animate({
      scrollTop: 0
    }, 1000);
  }

}
