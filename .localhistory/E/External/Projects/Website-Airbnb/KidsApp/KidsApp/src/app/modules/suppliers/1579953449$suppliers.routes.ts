import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Suppliers } from './components/suppliers';
import { SupplierInfo } from './components/supplierinfo';
import { SupplierActivities } from './components/activities/supplieractivities';
import { SupplierActivitiesList } from './components/activities/list/supplieractivitieslist';
import { AddEditActivity } from './components/activities/details/addeditactivity';
 

const routes: Routes = [
  {
    path: '', component: Suppliers, children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: SupplierInfo },
      {
        path: 'activities', component: SupplierActivities, children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: SupplierActivitiesList },
          { path: 'add', component: AddEditActivity },
          { path: 'add', component: AddEditActivity },
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
export class SuppliersRoutingModule { }

