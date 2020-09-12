import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Suppliers } from './components/suppliers';
import { SupplierActivities } from './components/activities/supplieractivities';
import { SupplierActivitiesList } from './components/activities/list/supplieractivitieslist';
import { SupplierInfo } from './components/info/supplierinfo';
import { SupplierCalendar } from './components/calendar/suppliercalendar';
import { SupplierBooking } from './components/bookings/supplierbooking';
import { ActivityDetails } from '../../shared/components/activity/activitydetails';
import { AddEditActivity } from '../../shared/components/activity/addeditactivity';

const routes: Routes = [
  {
    path: '', component: Suppliers, children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: SupplierInfo },
      { path: 'bookings', component: SupplierBooking },
      { path: 'calendar', component: SupplierCalendar },
      {
        path: 'activities', component: SupplierActivities, children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: SupplierActivitiesList },
          { path: 'add', component: AddEditActivity },
          { path: 'details/:id', component: ActivityDetails },
          { path: 'edit/:id', component: AddEditActivity },
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuppliersRoutingModule { }

