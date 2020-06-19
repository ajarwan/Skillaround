import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { ActivityRoutingModule } from './activity.routes';
import { ActivityService } from './activity.service';
import { ActivityList } from './components/activitylist';


@NgModule({
  declarations: [
    ActivityList
  ],
  imports: [
    ActivityRoutingModule,
    SharedModule

  ],
  providers: [ActivityService]
})
export class ActivityModule {

}
