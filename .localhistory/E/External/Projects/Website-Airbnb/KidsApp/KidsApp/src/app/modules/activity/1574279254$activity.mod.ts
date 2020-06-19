import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { ActivityListComponent } from './components/activitylist.component';
import { ActivityRoutingModule } from './activity.routes';


@NgModule({
  declarations: [
    ActivityListComponent
  ],
  imports: [
    ActivityRoutingModule,
    SharedModule

  ],
  providers: []
})
export class SearchModule {

}
