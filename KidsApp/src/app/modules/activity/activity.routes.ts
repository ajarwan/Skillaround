import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityList } from './components/activitylist';
import { ActivityDetails } from './components/activitydetails';


const routes: Routes = [
  { path: '', component: ActivityList },
  { path: 'details/:id', component: ActivityDetails },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ActivityRoutingModule { }

