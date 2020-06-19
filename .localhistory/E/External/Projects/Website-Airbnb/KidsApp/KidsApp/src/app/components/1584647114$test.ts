import { Component, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, Route, NavigationStart, NavigationEnd } from '@angular/router';
import { CoreService } from '../core/services/core.service';
import { BaseComponent } from '../core/core.base';
import { DataStore } from '../core/services/dataStrore.service';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared/service/shared.service';
import { User } from '../shared/Classes/User';
import { HttpInterceptor } from '../core/services/http.interceptor';
import { CoreSubjects } from '../core/core.subjects';
import { filter } from 'rxjs/operators';
import { CoreEnums } from '../core/core.enums';
import { CoreHelper } from '../core/services/core.helper';
import { SharedSubjects } from '../shared/service/shared.subjects';
import { AppEnums } from '../app.enums';
import { SocialMedialService } from '../services/socialMedia.Service';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale, arLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgSelectConfig } from '@ng-select/ng-select';
import { AppLoader } from '../shared/components/apploader';
import { AppHeader } from '../shared/components/appheader';
import { AppFooter } from '../shared/components/appfooter';
import { AppNotificationDialog } from '../shared/components/appnotificationdialog';
import { UsersService } from '../modules/users/users.service';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.html'
})
export class Test extends BaseComponent implements OnInit {

 
   
  /*****************************
 *    Constructor
 ****************************/
  constructor( ) {
    super();

     
  }

  

  /*****************************
   *    Implementations
   ****************************/
  ngOnInit(): void {

    

  }
   

   





}
