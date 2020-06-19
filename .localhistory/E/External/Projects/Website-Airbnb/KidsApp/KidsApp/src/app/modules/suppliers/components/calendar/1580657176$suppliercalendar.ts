import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CoreEnums } from 'src/app/core/core.enums';
import { ActivityService } from 'src/app/modules/activity/activity.service';

@Component({
  selector: 'suppliers-suppliercalendar',
  templateUrl: './suppliercalendar.html'
})
export class SupplierCalendar extends BaseComponent implements OnInit, AfterViewInit {


  /******************************************
   * Properties
   * ***************************************/
  calendarPlugins = [dayGridPlugin]; // important!
  @ViewChild('SupplierCalendar', null) SupplierCalendar: FullCalendarComponent;



  /*************************************
   *  Constructor
   *************************************/
  constructor(private ActivitySVC: ActivityService) {
    super();

  }

  public ngOnInit() {

    this.InitCalendar();

    //this.LoadActivities()


  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public InitCalendar() {
    this.SupplierCalendar.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    };
    if (this.Language == CoreEnums.Lang.Ar)
      this.SupplierCalendar.locale = 'ar';

    this.SupplierCalendar.defaultDate = this.formatDate(new Date(), 'yyyy-MM-dd');
    this.SupplierCalendar.navLinks = true; // can click day/week names to navigate views
    this.SupplierCalendar.editable = true;
    this.SupplierCalendar.eventLimit = true; // allow "more" link when too many events


    this.SupplierCalendar.datesRender.subscribe((res: any) => {
      console.log('rendered');
      console.log(res);
    })

    this.SupplierCalendar.eventRender.subscribe((res: any) => {
      console.log('rendered');
      console.log(res);
    })
  }

  public LoadActivities() {
    let Criteria: any = {

    }
    //this.ActivitySVC.FindAllActivities()
  }
}
