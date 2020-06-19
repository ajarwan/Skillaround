import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Admin } from './components/admin';
import { AdminDashboard } from './components/dashboard';
import { AdminUsers } from './components/users';
import { AdminSuppliers } from './components/suppliers';
import { AdminActivities } from './components/activities';
import { AdminCategorries } from './components/categories';
import { AdminMessages } from './components/messages';


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
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }

