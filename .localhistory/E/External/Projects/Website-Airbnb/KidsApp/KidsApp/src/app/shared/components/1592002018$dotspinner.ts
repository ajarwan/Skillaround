//Angular Imports
import { Component, ViewChild, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';


@Component({
  selector: 'shared-dotSpinner',
  templateUrl: './dotspinner.html'
})
export class DotSpinner extends BaseComponent implements OnInit {

  /*****************************
  *      Properties
  *****************************/



  /*****************************
  *      Constructor
  *****************************/

  constructor() {
    super();
  }

  /*****************************
  *      Implementations
  *****************************/

  ngOnInit() {


  }
  afterViewInit() {

  }
  onDestroy() {

  }

  /*****************************
   *      Methods
   *****************************/


}
