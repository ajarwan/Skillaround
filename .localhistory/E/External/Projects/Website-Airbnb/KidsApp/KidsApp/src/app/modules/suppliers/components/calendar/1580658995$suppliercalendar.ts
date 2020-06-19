import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CoreEnums } from 'src/app/core/core.enums';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

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

    if (this.Language == CoreEnums.Lang.Ar)
      this.SupplierCalendar.locale = 'ar';


    this.SupplierCalendar.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    };


    this.SupplierCalendar.defaultDate = this.formatDate(new Date(), 'yyyy-MM-dd');
    this.SupplierCalendar.navLinks = true; // can click day/week names to navigate views
    this.SupplierCalendar.editable = true;
    this.SupplierCalendar.eventLimit = true; // allow "more" link when too many events
    this.SupplierCalendar.events=[]
    //this.SupplierCalendar.events = [
    //  {
    //    title: 'All Day Event',
    //    start: '2020-02-02',
    //    url: 'http://google.com/',
    //  },
    //  {
    //    title: 'Long Event',
    //    start: '2020-02-04',
    //    end: '2020-02-09'
    //  },
    //  {
    //    id: 999,
    //    title: 'Repeating Event',
    //    start: '2019-01-09T16:00:00'
    //  },
    //  {
    //    id: 999,
    //    title: 'Repeating Event',
    //    start: '2019-01-16T16:00:00'
    //  },
    //  {
    //    title: 'Conference',
    //    start: '2019-01-11',
    //    end: '2019-01-13'
    //  },
    //  {
    //    title: 'Meeting',
    //    start: '2019-01-12T10:30:00',
    //    end: '2019-01-12T12:30:00'
    //  },
    //  {
    //    title: 'Lunch',
    //    start: '2019-01-12T12:00:00'
    //  },
    //  {
    //    title: 'Meeting',
    //    start: '2019-01-12T14:30:00'
    //  },
    //  {
    //    title: 'Happy Hour',
    //    start: '2019-01-12T17:30:00'
    //  },
    //  {
    //    title: 'Dinner',
    //    start: '2019-01-12T20:00:00'
    //  },
    //  {
    //    title: 'Birthday Party',
    //    start: '2019-01-13T07:00:00'
    //  },
    //  {
    //    title: 'Click for Google',
    //    url: 'http://google.com/',
    //    start: '2019-01-28'
    //  }
    //]

    this.SupplierCalendar.datesRender.subscribe((res: any) => {
      let d = new Date(res.view.currentStart);
      this.LoadActivities(d);
    })

    this.SupplierCalendar.eventRender.subscribe((res: any) => {
      console.log('rendered');
      console.log(res);
    })
  }

  public LoadActivities(date: Date) {

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let Criteria: any = {
      FromDate: firstDay,
      ToDate: lastDay,
      MyActivities: true
    }
    this.ActivitySVC.FindAllActivities(Criteria, -1, -1, "Id DESC", null, false).subscribe((res: any) => {
      this.DrawCalendarActivities(res.d);
    })
  }

  public DrawCalendarActivities(activities: any[]) {
    //this.SupplierCalendar.events = [];

    //let temEvents = [];
    //activities.forEach((x: any) => {
    //  temEvents.push({
    //    id: x.Id,
    //    title: x.Title,//'Long Event',
    //    start: this.formatDate(new Date(x.From), 'yyyy-MM-dd'),
    //    end: this.formatDate(new Date(x.To), 'yyyy-MM-dd'),
    //    url: '/supplier/activities/details/' + x.Id,
    //  });
    //})

    //debugger;
    //this.SupplierCalendar.events = temEvents;

    this.SupplierCalendar.events = [
      {
        title: 'All Day Event',
        start: '2020-02-02',
        url: 'http://google.com/',
      },
      {
        title: 'Long Event',
        start: '2020-02-04',
        end: '2020-02-09'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2019-01-09T16:00:00'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: '2019-01-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2019-01-11',
        end: '2019-01-13'
      },
      {
        title: 'Meeting',
        start: '2019-01-12T10:30:00',
        end: '2019-01-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2019-01-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2019-01-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2019-01-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2019-01-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2019-01-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2019-01-28'
      }
    ]
  }
}
