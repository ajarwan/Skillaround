import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'test' },
  { path: 'activity', loadChildren: () => import('./modules/activity/activity.mod').then(m => m.ActivityModule) }
  { path: 'test', loadChildren: () => import('./modules/test/test.mod').then(m => m.TestModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
