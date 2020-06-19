import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Suppliers } from './components/suppliers';
import { SupplierInfo } from './components/supplierinfo';


const routes: Routes = [
  {
    path: '', component: Suppliers, children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: SupplierInfo }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuppliersRoutingModule { }

