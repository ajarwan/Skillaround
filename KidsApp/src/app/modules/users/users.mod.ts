import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { UsersRoutingModule } from './users.routes';
import { UsersService } from './users.service';
import { MyNetwork } from './components/mynetwork';
import { ResetPassword } from './components/resetpassword';
import { ActivateUser } from './components/activate';
import { MyProfile } from './components/myprofile';


@NgModule({
  declarations: [
    MyNetwork,
    ResetPassword,
    ActivateUser,
    MyProfile
  ],
  imports: [
    UsersRoutingModule,
    SharedModule

  ],
  providers: [UsersService]
})
export class UsersModule {

}
