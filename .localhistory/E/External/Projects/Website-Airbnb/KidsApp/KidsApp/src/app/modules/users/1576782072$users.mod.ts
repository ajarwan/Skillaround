import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { UsersRoutingModule } from './users.routes';
import { UsersService } from './users.service';


@NgModule({
  declarations: [
  ],
  imports: [
    UsersRoutingModule,
    SharedModule

  ],
  providers: [UsersService]
})
export class UsersModule {

}
