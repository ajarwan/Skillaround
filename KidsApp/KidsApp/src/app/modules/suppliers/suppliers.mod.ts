import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.mod';
import { SuppliersService } from './suppliers.service';
import { SuppliersRoutingModule } from './suppliers.routes';
import { Suppliers } from './components/suppliers';
import { SupplierActivitiesList } from './components/activities/list/supplieractivitieslist';
import { AddEditActivity } from './components/activities/details/addeditactivity';
import { ActivityDetails } from './components/activities/details/activitydetails';
import { SupplierInfo } from './components/info/supplierinfo';
import { SupplierCalendar } from './components/calendar/suppliercalendar';
import { SupplierActivities } from './components/activities/supplieractivities';
import { SupplierBooking } from './components/bookings/supplierbooking';



@NgModule({
  declarations: [
    Suppliers,
    SupplierInfo,
    AddEditActivity,
    SupplierActivities,
    SupplierActivitiesList,
    ActivityDetails,
    SupplierCalendar,
    SupplierBooking
  ],
  imports: [
    SuppliersRoutingModule,
    SharedModule

  ],
  providers: [SuppliersService]
})
export class SuppliersModule {

}
