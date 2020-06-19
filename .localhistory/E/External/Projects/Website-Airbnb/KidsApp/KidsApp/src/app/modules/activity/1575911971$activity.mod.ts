import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { ActivityListComponent } from './components/activitylist.component';
import { ActivityRoutingModule } from './activity.routes';
import { ActivityService } from './activity.service';


@NgModule({
  declarations: [
    ActivityListComponent
  ],
  imports: [
    ActivityRoutingModule,
    SharedModule

  ],
  providers: [ActivityService]
})
export class ActivityModule {

}
