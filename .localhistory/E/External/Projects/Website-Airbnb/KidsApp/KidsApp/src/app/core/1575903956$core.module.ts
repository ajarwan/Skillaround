import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgInviewModule } from 'angular-inport';
import { RatingModule } from 'ng-starrating';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
//import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppClick, AppHidden, AppCharLimit, AppEnter, AppImageError } from './directives/core.directives';
import { PopoverModule } from 'ngx-bootstrap';

import {
  AppEmptyReplacer,
  AppMoneyFormat,
  AppTruncateWords,
  AppTruncateText,
  AppFilterPipe,
  AppNumberSeparator,
  AppSafeHtmlPipe,
  AppTimeStringIn12Hr
} from './pipes/core.pipes';
import { HttpClientModule } from '@angular/common/http';


const CORE_DECLARATIONS = [
  AppClick,
  AppHidden,
  AppCharLimit,
  AppEnter,
  AppImageError,
  AppEmptyReplacer,
  AppMoneyFormat,
  AppTruncateWords,
  AppTruncateText,
  AppFilterPipe,
  AppNumberSeparator,
  AppSafeHtmlPipe,
  AppTimeStringIn12Hr
];

@NgModule({
  declarations: [
    CORE_DECLARATIONS
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgInviewModule,
    RatingModule,
    BsDatepickerModule.forRoot(),
    SweetAlert2Module.forRoot(),
    PopoverModule.forRoot(),
    NgbModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgInviewModule,
    RatingModule,
    BsDatepickerModule,
    CORE_DECLARATIONS,
    SweetAlert2Module,
    PopoverModule,
    NgbModule

  ],
  providers: []
})
export class CoreModule {

  constructor() {

  }
}
