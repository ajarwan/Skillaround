import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { SharedService } from './service/shared.service';
import { UnderlineDirective, StickySideBar } from './directives/shared.directives';
import { CoreModule } from '../core/core.module';
import { SideBarTabsComponent } from './components/sidebar-tabs.component';
import { AppPager } from './components/pager.component';
import { EmployeeProfileComponent } from './components/employeeprofile/employeeprofile.component';
//import { EmployeeProfileComponent } from './components/employeeProfile/employeeprofile.component';


const SHARED_DECLARATIONS = [
  UnderlineDirective,
  StickySideBar,
  SideBarTabsComponent,
  EmployeeProfileComponent,
  AppPager
];


@NgModule({
  declarations: [
    SHARED_DECLARATIONS
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    SlickCarouselModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CoreModule,
    SlickCarouselModule,
    SHARED_DECLARATIONS
  ],
  providers: [SharedService]
})
export class SharedModule {


}
