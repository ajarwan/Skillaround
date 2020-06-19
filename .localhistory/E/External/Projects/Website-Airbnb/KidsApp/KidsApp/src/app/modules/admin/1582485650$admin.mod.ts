import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { AdminRoutingModule } from './admin.routes';
import { AdminService } from './admin.service';
import { Admin } from './components/admin';
import { AdminDashboard } from './components/dashboard';
import { AdminUsers } from './components/users';
import { AdminSuppliers } from './components/suppliers';
import { AdminActivities } from './components/activities';
import { AdminCategorries } from './components/categories';


@NgModule({
  declarations: [
    Admin,
    AdminDashboard,
    AdminUsers,
    AdminSuppliers,
    AdminActivities,
    AdminCategorries
  ],
  imports: [
    AdminRoutingModule,
    SharedModule

  ],
  providers: [AdminService]
})
export class AdminModule {

}
