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
import { AdminMessages } from './components/messages';
import { AboutAdmin } from './components/aboutAdmin';
import { TACAdmin } from './components/tac';
import { PACAdmin } from './components/pac';


@NgModule({
  declarations: [
    Admin,
    AdminDashboard,
    AdminUsers,
    AdminSuppliers,
    AdminActivities,
    AdminCategorries,
    AdminMessages,
    AboutAdmin,
    TACAdmin,
    PACAdmin
  ],
  imports: [
    AdminRoutingModule,
    SharedModule

  ],
  providers: [AdminService]
})
export class AdminModule {

}
