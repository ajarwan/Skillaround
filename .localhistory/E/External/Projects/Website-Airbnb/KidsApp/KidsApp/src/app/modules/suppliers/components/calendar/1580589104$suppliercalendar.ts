import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'suppliers-suppliercalendar',
  templateUrl: './suppliercalendar.html'
})
export class SupplierCalendar extends BaseComponent implements OnInit, AfterViewInit {


  /******************************************
   * Properties
   * ***************************************/
  calendarPlugins = [dayGridPlugin]; // important!



  /*************************************
   *  Constructor
   *************************************/
  constructor() {
    super();

  }

  public ngOnInit() {




  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

}
