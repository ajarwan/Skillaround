import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CoreEnums } from 'src/app/core/core.enums';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { CoreHelper } from 'src/app/core/services/core.helper';

declare var $: any;

@Component({
  selector: 'suppliers-suppliercalendar',
  templateUrl: './suppliercalendar.html'
})
export class SupplierCalendar extends BaseComponent implements OnInit, AfterViewInit {


  /******************************************
   * Properties
   * ***************************************/
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

  @ViewChild('SupplierCalendar', null) SupplierCalendar: FullCalendarComponent;

  public Activities: any[] = [];

  public IsLoading: boolean = false;


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
      //right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    };


    this.SupplierCalendar.defaultDate = this.formatDate(new Date(), 'yyyy-MM-dd');
    this.SupplierCalendar.navLinks = true; // can click day/week names to navigate views
    this.SupplierCalendar.editable = true;
    this.SupplierCalendar.eventLimit = true; // allow "more" link when too many events



    this.SupplierCalendar.eventRender.subscribe((obj: any) => {
      //console.log('rendered');
      // console.log(obj);

      if (!obj.event.extendedProps.isPosted) {
        $(obj.el).addClass('not-posted')
      }
      else {
        $(obj.el).addClass('posted')
      }

      $(obj.el).click(() => {
        this.navigate('/supplier/activities/details/' + obj.event.id)
      })
    })

    this.SupplierCalendar.datesRender.subscribe((res: any) => {
      console.log('datesRender');
      let d = new Date(res.view.currentStart);
      this.LoadActivities(d);
    })


  }

  public LoadActivities(date: Date) {
    this.IsLoading = true;
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let Criteria: any = {
      FromDate: firstDay,
      ToDate: lastDay,
      MyActivities: true
    }
    this.ActivitySVC.FindAllActivities(Criteria, -1, -1, "Id DESC", null, false).subscribe((res: any) => {
      this.DrawCalendarActivities(res.d);
      this.IsLoading = false;
    })
  }

  public DrawCalendarActivities(activities: any[]) {
    this.SupplierCalendar.events = [];

    let temEvents = [];
    activities.forEach((x: any) => {

      let sDate = new Date(x.From);
      let eDate = new Date(x.To);

      CoreHelper.ClearTime(sDate);
      CoreHelper.ClearTime(eDate);


      if (sDate == eDate) {
        temEvents.push({
          id: x.Id,
          title: x.Title,//'Long Event',
          date: this.formatDate(new Date(x.From), 'yyyy-MM-dd'),
          start: this.formatDate(new Date(x.From), 'yyyy-MM-dd'),
          //end: this.formatDate((new Date(x.To)).setDate((new Date(x.To)).getDate() + 1), 'yyyy-MM-dd'),
          startD: new Date(x.From),
          endD: new Date(x.To),
          //url: '/supplier/activities/details/' + x.Id,
          isPosted: x.IsPosted
        });
      }
      else {

        for (let d = sDate; d <= eDate; d.setDate(d.getDate() + 1)) {

          temEvents.push({
            id: x.Id,
            title: x.Title,//'Long Event',
            date: this.formatDate(d, 'yyyy-MM-dd'),
            start: this.formatDate(d, 'yyyy-MM-dd'),
            //end: this.formatDate(d.setDate(d.getDate() + 1), 'yyyy-MM-dd'),
            startD: d,
            endD: d,
            //url: '/supplier/activities/details/' + x.Id,
            isPosted: x.IsPosted
          });

        }

      }


    })





    this.Activities = temEvents;

    //debugger;
    //this.SupplierCalendar.events = temEvents;
    //debugger;
  }
}
