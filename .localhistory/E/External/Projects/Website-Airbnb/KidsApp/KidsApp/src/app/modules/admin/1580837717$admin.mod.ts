import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { AdminRoutingModule } from './admin.routes';
import { AdminService } from './admin.service';
import { Admin } from './components/admin';
import { AdminDashboard } from './components/dashboard';
import { AdminUsers } from './components/users';


@NgModule({
  declarations: [
    Admin,
    AdminDashboard,
    AdminUsers
  ],
  imports: [
    AdminRoutingModule,
    SharedModule

  ],
  providers: [AdminService]
})
export class AdminModule {

}
