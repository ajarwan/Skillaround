import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Landing } from './components/landing/landing';
import { ContactUs } from './components/contactus/contactus';

const routes: Routes = [
  { path: '', component: Landing },
  { path: 'contactus', component: ContactUs },
  { path: 'activity', loadChildren: () => import('./modules/activity/activity.mod').then(m => m.ActivityModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.mod').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./modules/users/users.mod').then(m => m.UsersModule) },
  //{ path: 'error', component: Errorpage },
  //{ path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
