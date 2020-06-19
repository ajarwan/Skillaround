//Angular2 Imports
import { Component, OnInit, Input, Output, EventEmitter, forwardRef, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppEnums } from 'src/app/app.enums';
import { CoreEnums } from 'src/app/core/core.enums';
import { DataStore } from 'src/app/core/services/dataStrore.service';

//Evventa Imports

enum TimeUnit {
  Hours = 1,
  Mins = 2
}

enum TimeFormat {
  AM = 1,
  PM = 2
}

enum ChangeType {
  Increment = 1,
  Decrement = 2
}

@Component({
  selector: 'shared-timepicker',
  templateUrl: './timePicker.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Timepicker),
    multi: true
  }]
})

export class Timepicker implements OnInit, OnDestroy {

  /*****************************
   *      Properties
   *****************************/

  public IsTimeSelectorShown = false;
  public ClickInside: boolean;
  public Hours = 0;
  public Mins = 0;
  public TimeFormat = CoreEnums.TimeFormat.AM;

  public DocumentClick = this.OnDomClick.bind(this);


  public AppEnums = AppEnums;
  public CoreEnums = CoreEnums;
  public resources = DataStore.resources;


  @Output() onItemSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('controlInput', null) public controlInput: ElementRef;



  /*****************************
   *      Constructor
   *****************************/

  constructor() {

  }

  /*****************************
   *      Implementations
   *****************************/

  ngOnInit() {
    //this.hoursInput = this.hoursInput.nativeElement;
    //this.minsInput = this.minsInput.nativeElement;

    document.addEventListener('click', this.DocumentClick);
  }

  afterViewInit() {
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.DocumentClick);

  }

  propagateChange = (_: any) => { };

  writeValue(value: any): void {
    //if (this.isDuration) {
    //  this.hourMode = AppEnums.HourMode.TwentyFour;
    //  this.SelectedTimeFormat = null;
    //  this.hoursInput.nativeElement.maxLength = 3;
    //}
    //else {
    //  this.hoursInput.nativeElement.maxLength = 2;
    //}


    //if (value != null) {

    //  if (this.isDuration == true) {
    //    // value is duration in minutes
    //    let hours = Math.floor(value / 60);
    //    let mins = (Math.floor(value % 60));

    //    let hoursStr = hours.toString().length == 1 ? "0" + hours : hours.toString();
    //    let minsStr = mins.toString().length == 1 ? "0" + mins : mins.toString();

    //    value = hoursStr + ":" + minsStr + ":00";
    //  }
    //  this.Time = value;

    //  this.Hours = parseInt(this.Time.slice(0, 2)).toString();

    //  if (this.hourMode == AppEnums.HourMode.TwentyFour) {
    //    this.SelectedTimeFormat = null;
    //  }
    //  else {
    //    // Show AM or PM

    //    if (parseInt(this.Hours) == 0) {
    //      this.Hours = "12";
    //      this.SelectedTimeFormat = TimeFormat.AM;
    //    }
    //    else if (parseInt(this.Hours) >= 12) {
    //      this.SelectedTimeFormat = TimeFormat.PM;

    //      if (parseInt(this.Hours) > 12)
    //        this.Hours = (parseInt(this.Hours) - 12).toString();
    //    }
    //  }

    //  // Show left side zero
    //  if (this.Hours.length == 0)
    //    this.Hours = "00";
    //  else {

    //    if (this.Hours.length == 1)
    //      this.Hours = "0" + this.Hours;
    //    else
    //      this.Hours = this.Hours;
    //  }

    //  let mins = parseInt(this.Time.slice(3, 5));

    //  if (mins == 0)
    //    this.Mins = "00";
    //  else {

    //    if (mins.toString().length == 1)
    //      this.Mins = "0" + mins.toString();
    //    else
    //      this.Mins = mins.toString();
    //  }

    //  //in duration the time should be number -- total mins
    //  //if (this.isDuration)
    //  //    this.Time = ((parseInt(this.Hours) * 60) + parseInt(this.Mins)).toString();

    //  //this.propagateChange(this.Time);
    //}
    //else {
    //  this.Time = "00:00:00";
    //  this.Hours = "";
    //  this.Mins = "";
    //}
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

  /*****************************
   *      Methods
   *****************************/
  public OnFocus() {
    this.IsTimeSelectorShown = true;
  }

  public OnBlur() {
    console.log("blur")
    if (this.ClickInside) {
      this.ClickInside = false;
      this.IsTimeSelectorShown = true;
      this.controlInput.nativeElement.focus();
      return;
    }
    this.IsTimeSelectorShown = false;
  }

  public OnClickInside() {
    console.log("inside")
    this.ClickInside = true;
  }

  public OnDomClick(): void {
    this.IsTimeSelectorShown = false;
  }
}
