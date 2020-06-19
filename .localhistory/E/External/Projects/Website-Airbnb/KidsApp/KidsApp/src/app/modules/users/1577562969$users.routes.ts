import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNetwork } from './components/mynetwork';
import { ResetPassword } from './components/resetpassword';


const routes: Routes = [
  { path: '', component: MyNetwork },
  { path: 'mynetwork', component: MyNetwork },
  { path: 'resetpaswod/:id', component: ResetPassword },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule { }

