import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { SuppliersService } from './suppliers.service';
import { SuppliersRoutingModule } from './suppliers.routes';


@NgModule({
  declarations: [
  ],
  imports: [
    SuppliersRoutingModule,
    SharedModule

  ],
  providers: [SuppliersService]
})
export class MyNetworkModule {

}
