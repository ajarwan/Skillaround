import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';

@Component({
  selector: 'activity-list',
  templateUrl: './activitylist.component.html'
})
export class ActivityListComponent extends BaseComponent {


  constructor() {
    super();
  }

}
