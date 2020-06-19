import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Suppliers } from './components/suppliers';


const routes: Routes = [
  { path: '', component: Suppliers }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuppliersRoutingModule { }

