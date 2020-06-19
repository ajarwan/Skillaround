import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { SharedService } from './service/shared.service';
import { UnderlineDirective } from './directives/shared.directives';
import { CoreModule } from '../core/core.module';
import { AppPager } from './components/pager';
 

const SHARED_DECLARATIONS = [
  UnderlineDirective,
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
