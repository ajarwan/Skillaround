import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityListComponent } from './components/activitylist.component';

const routes: Routes = [
  { path: '', component: ActivityListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ActivityRoutingModule { }

