import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent {

  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService, private modalService: NgbModal) {
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

  public OpenLogin() {
 
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
