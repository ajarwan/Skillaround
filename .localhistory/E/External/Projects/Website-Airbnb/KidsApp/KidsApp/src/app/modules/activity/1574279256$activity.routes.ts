import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchListComponent } from './components/activitylist.component';

const routes: Routes = [
  { path: '', component: ActiityListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ActivityRoutingModule { }

