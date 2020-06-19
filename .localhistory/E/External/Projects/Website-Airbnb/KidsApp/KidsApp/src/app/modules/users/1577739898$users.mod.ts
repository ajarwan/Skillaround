import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { UsersRoutingModule } from './users.routes';
import { UsersService } from './users.service';
import { MyNetwork } from './components/mynetwork';
import { ResetPassword } from './components/resetpassword';


@NgModule({
  declarations: [
    MyNetwork,
    ResetPassword
  ],
  imports: [
    UsersRoutingModule,
    SharedModule

  ],
  providers: [UsersService]
})
export class UsersModule {

}
