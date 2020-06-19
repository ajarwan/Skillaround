import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchListComponent } from './components/searchlist.component';

const routes: Routes = [
  { path: '', component: SearchListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SearchRoutingModule { }

