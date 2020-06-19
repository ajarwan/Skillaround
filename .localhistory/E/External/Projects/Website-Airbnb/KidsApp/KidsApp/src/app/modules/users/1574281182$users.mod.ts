import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { USersRoutingModule } from './users.routes';
import { UsersService } from './users.service';


@NgModule({
  declarations: [
  ],
  imports: [
    USersRoutingModule,
    SharedModule

  ],
  providers: [UsersService]
})
export class UsersModule {

}
