import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Suppliers } from './components/suppliers';
import { SupplierInfo } from './components/supplierinfo';
import { SupplierActivities } from './components/supplieractivities';
import { AddEditActivity } from './components/addeditactivity';


const routes: Routes = [
  {
    path: '', component: Suppliers, children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: SupplierInfo },
      { path: 'activities', component: SupplierActivities },
      { path: 'addactivity', component: AddEditActivity }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuppliersRoutingModule { }

