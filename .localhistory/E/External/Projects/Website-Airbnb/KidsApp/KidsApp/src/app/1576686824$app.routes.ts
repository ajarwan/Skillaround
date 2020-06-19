import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Landing } from './components/landing/landing';

const routes: Routes = [
  { path: '', component: Landing },
  { path: 'activity', loadChildren: () => import('./modules/activity/activity.mod').then(m => m.ActivityModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.mod').then(m => m.AdminModule) },
  { path: 'test', loadChildren: () => import('./modules/test/test.mod').then(m => m.TestModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
