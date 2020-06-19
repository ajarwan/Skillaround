import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule) },
  { path: 'cpc', loadChildren: () => import('./modules/cpc/cpc.module').then(m => m.CPCModule) },
  { path: 'olomna', loadChildren: () => import('./modules/olomna/olomna.module').then(m => m.OlomnaModule) },
  { path: 'services', loadChildren: () => import('./modules/services/services.module').then(m => m.ServicesModule) },
  { path: 'media', loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule) },
  { path: 'contactus', loadChildren: () => import('./modules/contactus/contactus.module').then(m => m.ContactUsModule) },
  { path: 'test', loadChildren: () => import('./modules/test/test.mod').then(m => m.TestModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
