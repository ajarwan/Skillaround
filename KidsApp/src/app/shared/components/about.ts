import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as $ from 'jquery';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { AppEnums } from 'src/app/app.enums';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.html'
})
export class AboutUs extends BaseComponent implements OnInit {

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
    this.LoadData();
  }


  public LoadData() {
    this.adminSVC.FindContentAdminByType(AppEnums.ContentAdminType.AboutUs, true).subscribe((res: any) => {
      this.Content = this.sanitized.bypassSecurityTrustHtml(this.localizeData(res.ContentAr, res.ContentEn))
    })
  }



}
