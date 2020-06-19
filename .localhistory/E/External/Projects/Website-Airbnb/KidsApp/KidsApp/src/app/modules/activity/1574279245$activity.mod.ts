import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
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
