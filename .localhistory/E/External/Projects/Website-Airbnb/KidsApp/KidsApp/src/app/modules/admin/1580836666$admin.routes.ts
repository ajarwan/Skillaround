import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Admin } from './components/admin';


const routes: Routes = [
  {
    path: '', component: Admin
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }

