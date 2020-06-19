import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNetwork } from './components/mynetwork';
import { ResetPassword } from './components/resetpassword';
import { ActivateUser } from './components/activate';
import { MyProfile } from './components/myprofile';


const routes: Routes = [
  { path: '', component: MyNetwork },
  { path: 'mynetwork', component: MyNetwork },
  { path: 'myprofile', component: MyProfile },
  { path: 'resetpassword/:id', component: ResetPassword },
  { path: 'activate/:id', component: ActivateUser },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule { }

