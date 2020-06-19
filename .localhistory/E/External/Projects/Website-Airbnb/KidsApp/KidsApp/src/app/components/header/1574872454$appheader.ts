import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent {

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService) {
    super();
  }


}
