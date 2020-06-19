import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment.prod';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
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

  public ChangeLang() {
    if (environment.Lang == 'ar') {
      DataStore.addUpdate('Lang', 'en', CoreEnums.StorageLocation.LocalStorge);
    }
    else
      DataStore.addUpdate('Lang', 'ar', CoreEnums.StorageLocation.LocalStorge);

    location.reload();
  }
}
