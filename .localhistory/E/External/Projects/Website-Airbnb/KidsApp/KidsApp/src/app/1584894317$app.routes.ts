import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Landing } from './components/landing/landing';
import { ContactUs } from './shared/components/contactus';
import { Test } from './components/test';
import { AboutUs } from './shared/components/about';

const routes: Routes = [
  { path: '', component: Landing },
  { path: 'contactus', component: ContactUs },
  { path: 'aboutus', component: AboutUs },
  { path: 'termsandconditions', component: TermsAndConditions },
  { path: 'test', component: Test },
  { path: 'activity', loadChildren: () => import('./modules/activity/activity.mod').then(m => m.ActivityModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.mod').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./modules/users/users.mod').then(m => m.UsersModule) },
  { path: 'supplier', loadChildren: () => import('./modules/suppliers/suppliers.mod').then(m => m.SuppliersModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.mod').then(m => m.AdminModule) },
  //{ path: 'error', component: Errorpage },
  //{ path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
