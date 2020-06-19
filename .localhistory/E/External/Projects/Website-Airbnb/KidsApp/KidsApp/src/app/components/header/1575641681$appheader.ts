import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './appheader.html'
})
export class AppHeader extends BaseComponent implements AfterViewInit {

  @ViewChild('loginLink', null) loginLink: HTMLElement;

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

  ngAfterViewInit() {
    console.log(this.loginLink);
    $('#access_link').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in'
    });
  }
  open(content) {

   


    //this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //}, (reason) => {
    //});
  }
}
