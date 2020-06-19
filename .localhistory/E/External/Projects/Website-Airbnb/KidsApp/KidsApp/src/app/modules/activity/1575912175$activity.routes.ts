import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityList } from './components/activitylist';


const routes: Routes = [
  { path: '', component: ActivityList }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ActivityRoutingModule { }

