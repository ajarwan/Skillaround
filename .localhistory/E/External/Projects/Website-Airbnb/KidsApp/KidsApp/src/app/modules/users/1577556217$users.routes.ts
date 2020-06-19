import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNetwork } from './components/mynetwork';


const routes: Routes = [
  { path: '', component: MyNetwork },
  { path: 'mynetwork', component: MyNetwork },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule { }

