import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgInviewModule } from 'angular-inport';
import { RatingModule } from 'ng-starrating';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CPCClick, CPCHidden, CPCCharLimit, CPCEnter, CPCImageError } from './directives/core.directives';
import {
  CPCEmptyReplacer,
  CPCMoneyFormat,
  CPCTruncateWords,
  CPCTruncateText,
  CPCFilterPipe,
  CPCNumberSeparator,
  CPCSafeHtmlPipe,
  CPCTimeStringIn12Hr
} from './pipes/core.pipes';
import { HttpClientModule } from '@angular/common/http';


const CORE_DECLARATIONS = [
  CPCClick,
  CPCHidden,
  CPCCharLimit,
  CPCEnter,
  CPCEmptyReplacer,
  CPCMoneyFormat,
  CPCTruncateWords,
  CPCTruncateText,
  CPCFilterPipe,
  CPCNumberSeparator,
  CPCSafeHtmlPipe,
  CPCTimeStringIn12Hr,
  CPCImageError
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
    TimepickerModule.forRoot(),
    MatAutocompleteModule
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
    MatAutocompleteModule,
    TimepickerModule
  ],
  providers: []
})
export class CoreModule {

  constructor() {

  }
}
