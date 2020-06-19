import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppEnums } from 'src/app/app.enums';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html'
})
export class Privacy extends BaseComponent implements OnInit {

  public Content: any = '';
  /*****************************
 *    Constructor
 ****************************/
  constructor(private sharedSVC: SharedService,
    private adminSVC: AdminService,
    private sanitized: DomSanitizer) {
    super();
  }

  public ngOnInit() {
  }


  public LoadData() {
    this.adminSVC.FindContentAdminByType(AppEnums.ContentAdminType.Privacy, true).subscribe((res: any) => {
      this.Content = this.sanitized.bypassSecurityTrustHtml(this.localizeData(res.ContentAr, res.ContentEn))
    })
  }




}
