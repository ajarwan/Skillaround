 import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { SuppliersService } from './suppliers.service';
import { SuppliersRoutingModule } from './suppliers.routes';
import { Suppliers } from './components/suppliers';
import { SuppliersSideBar } from './components/suppliers-sidebar';
import { SupplierInfo } from './components/supplierinfo';
import { SupplierActivities } from './components/activities/supplieractivities';
import { SupplierActivitiesList } from './components/activities/list/supplieractivitieslist';
import { AddEditActivity } from './components/activities/details/addeditactivity';
import { ActivityDetails } from './components/activities/details/activitydetails';
 


@NgModule({
  declarations: [
    Suppliers,
    SuppliersSideBar,
    SupplierInfo,
    SupplierActivities,
    AddEditActivity,
    SupplierActivitiesList,
    ActivityDetails
  ],
  imports: [
    SuppliersRoutingModule,
    SharedModule

  ],
  providers: [SuppliersService]
})
export class SuppliersModule {

}
