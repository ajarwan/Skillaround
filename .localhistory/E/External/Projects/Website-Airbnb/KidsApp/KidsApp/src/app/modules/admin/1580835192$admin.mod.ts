import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { AdminRoutingModule } from './admin.routes';
import { AdminService } from './admin.service';


@NgModule({
  declarations: [
  ],
  imports: [
    AdminRoutingModule,
    SharedModule

  ],
  providers: [AdminService]
})
export class AdminModule {

}
