//Angular Imports
import { Component, ViewChild, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DataStore } from '../../core/services/dataStrore.service';
import { BaseComponent } from '../../core/core.base';


@Component({
  selector: 'shared-headernotification',
  templateUrl: './headernotification.html'
})
export class HeaderNotification extends BaseComponent {

  /*****************************
  *      Properties
  *****************************/
  get Count() {
    return DataStore.get('NotificationsCount')

  }


  /*****************************
  *      Constructor
  *****************************/

  constructor() {
    super();
  }

  /*****************************
  *      Implementations
  *****************************/

  onInit() {


  }
  afterViewInit() {

  }
  onDestroy() {

  }

  /*****************************
   *      Methods
   *****************************/


}
