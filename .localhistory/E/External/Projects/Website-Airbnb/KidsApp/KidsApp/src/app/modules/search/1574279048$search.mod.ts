import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TestPageComponent } from './components/test.component';
import { SharedModule } from 'src/app/shared/shared.mod';
import { TestRoutingModule } from './test.routes';
import { TestService } from 'src/app/services/test.service';
import { SearchListComponent } from './components/searchlist.component';
import { SearchRoutingModule } from './search.routes';


@NgModule({
  declarations: [
    SearchListComponent
  ],
  imports: [
    SearchRoutingModule,
    SharedModule

  ],
  providers: []
})
export class SearchModule {

}
