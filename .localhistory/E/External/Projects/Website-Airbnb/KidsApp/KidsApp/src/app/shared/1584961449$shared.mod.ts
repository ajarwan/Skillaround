import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { SharedService } from './service/shared.service';
import { UnderlineDirective } from './directives/shared.directives';
import { CoreModule } from '../core/core.module';
import { AppPager } from './components/pager';
import { DotSpinner } from './components/dotspinner';
import { AppHeader } from './components/appheader';
import { AppFooter } from './components/appfooter';
import { AppLoader } from './components/apploader';
import { AppNotificationDialog } from './components/appnotificationdialog';
import { UserAttachmentsModal } from './components/users/userAttachmentsModal';
import { HeaderNotification } from './components/headernotification';
import { Timepicker } from './components/timePicker';
import { AboutUs } from './components/about';
import { TermsAndConditions } from './components/tac';


const SHARED_DECLARATIONS = [
  UnderlineDirective,
  AppPager,
  AppHeader,
  AppFooter,
  AppLoader,
  AppNotificationDialog,
  UserAttachmentsModal,
  HeaderNotification,
  Timepicker,
  AboutUs,
  TermsAndConditions
];


@NgModule({
  declarations: [
    SHARED_DECLARATIONS
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CoreModule,
    SHARED_DECLARATIONS
  ],
  providers: [SharedService]
})
export class SharedModule {


}
