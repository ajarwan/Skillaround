import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Admin } from './components/admin';
import { AdminDashboard } from './components/dashboard';
import { AdminUsers } from './components/users';
import { AdminSuppliers } from './components/suppliers';
import { AdminActivities } from './components/activities';


const routes: Routes = [
  {
    path: '', component: Admin, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'suppliers', component: AdminSuppliers },
      { path: 'suppliactivitiesers', component: AdminActivities },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }

