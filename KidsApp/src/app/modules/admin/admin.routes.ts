import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Admin } from './components/admin';
import { AdminDashboard } from './components/dashboard';
import { AdminUsers } from './components/users';
import { AdminSuppliers } from './components/suppliers';
import { AdminActivities } from './components/activities';
import { AdminCategorries } from './components/categories';
import { AdminMessages } from './components/messages';
import { AboutAdmin } from './components/aboutAdmin';
import { TACAdmin } from './components/tac';
import { PACAdmin } from './components/pac';
import { Mailers } from './components/mailers';
import { AdminManagedActivities } from './components/activities/adminactivities';
import { AdminActivityList } from './components/activities/list/adminactivitylist';
import { AddEditActivity } from 'src/app/shared/components/activity/addeditactivity';
import { ActivityDetails } from 'src/app/shared/components/activity/activitydetails';


const routes: Routes = [
  {
    path: '', component: Admin, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'suppliers', component: AdminSuppliers },
      { path: 'activities', component: AdminActivities },
      { path: 'categories', component: AdminCategorries },
      { path: 'messages', component: AdminMessages },
      { path: 'aboutus', component: AboutAdmin },
      { path: 'tac', component: TACAdmin },
      { path: 'pac', component: PACAdmin },
      { path: 'mailers', component: Mailers },
      {
        path: 'managedactivities', component: AdminManagedActivities, children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: AdminActivityList },
          { path: 'add', component: AddEditActivity },
          { path: 'details/:id', component: ActivityDetails },
          { path: 'edit/:id', component: AddEditActivity },
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }

