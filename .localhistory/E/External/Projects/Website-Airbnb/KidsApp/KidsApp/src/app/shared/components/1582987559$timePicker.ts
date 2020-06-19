//Angular2 Imports
import { Component, OnInit, Input, Output, EventEmitter, forwardRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppEnums } from 'src/app/app.enums';
import { CoreEnums } from 'src/app/core/core.enums';

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

export class Timepicker  {

  /*****************************
   *      Properties
   *****************************/
  public AppEnums = AppEnums;
  public CoreEnums = CoreEnums;

  public Hours: string;

  public Mins: string;

  public Time: string;

  public TimeUnit = TimeUnit;

  public ChangeType = ChangeType;

  public SelectedTimeFormat: TimeFormat = TimeFormat.AM;

  public TimeFormat = TimeFormat;

  @Input() isDuration: boolean = false;

  @Input() timeUnitMode: AppEnums.TimePickerMode = AppEnums.TimePickerMode.HoursAndMins;

  @Input() hourMode: AppEnums.HourMode = AppEnums.HourMode.Twelve;

  @Input() disabled: boolean = false;

  @Output() onItemSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('hoursInput',null) public hoursInput: ElementRef;

  @ViewChild('minsInput', null) public minsInput: ElementRef;


  /*****************************
   *      Constructor
   *****************************/

  constructor() {
     
  }

  /*****************************
   *      Implementations
   *****************************/

  onInit() {
    //this.hoursInput = this.hoursInput.nativeElement;
    //this.minsInput = this.minsInput.nativeElement;
  }

  afterViewInit() {
  }

  onDestroy() {
  }

  propagateChange = (_: any) => { };

  writeValue(value: any): void {
    if (this.isDuration) {
      this.hourMode = AppEnums.HourMode.TwentyFour;
      this.SelectedTimeFormat = null;
      this.hoursInput.nativeElement.maxLength = 3;
    }
    else {
      this.hoursInput.nativeElement.maxLength = 2;
    }


    if (value != null) {

      if (this.isDuration == true) {
        // value is duration in minutes
        let hours = Math.floor(value / 60);
        let mins = (Math.floor(value % 60));

        let hoursStr = hours.toString().length == 1 ? "0" + hours : hours.toString();
        let minsStr = mins.toString().length == 1 ? "0" + mins : mins.toString();

        value = hoursStr + ":" + minsStr + ":00";
      }
      this.Time = value;

      this.Hours = parseInt(this.Time.slice(0, 2)).toString();

      if (this.hourMode == AppEnums.HourMode.TwentyFour) {
        this.SelectedTimeFormat = null;
      }
      else {
        // Show AM or PM

        if (parseInt(this.Hours) == 0) {
          this.Hours = "12";
          this.SelectedTimeFormat = TimeFormat.AM;
        }
        else if (parseInt(this.Hours) >= 12) {
          this.SelectedTimeFormat = TimeFormat.PM;

          if (parseInt(this.Hours) > 12)
            this.Hours = (parseInt(this.Hours) - 12).toString();
        }
      }

      // Show left side zero
      if (this.Hours.length == 0)
        this.Hours = "00";
      else {

        if (this.Hours.length == 1)
          this.Hours = "0" + this.Hours;
        else
          this.Hours = this.Hours;
      }

      let mins = parseInt(this.Time.slice(3, 5));

      if (mins == 0)
        this.Mins = "00";
      else {

        if (mins.toString().length == 1)
          this.Mins = "0" + mins.toString();
        else
          this.Mins = mins.toString();
      }

      //in duration the time should be number -- total mins
      //if (this.isDuration)
      //    this.Time = ((parseInt(this.Hours) * 60) + parseInt(this.Mins)).toString();

      //this.propagateChange(this.Time);
    }
    else {
      this.Time = "00:00:00";
      this.Hours = "";
      this.Mins = "";
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

  /*****************************
   *      Methods
   *****************************/

  public ValidateAndSelectTime(): void {

    if (this.Time == null)
      this.Time = "00:00:00";

    if ((this.Hours == "" || this.Hours == null) && (this.Mins == "" || this.Mins == null)) {
      this.Time = null;
      this.propagateChange(this.Time);
      this.onItemSelected.emit(this.Time);
      return;
    }

    else {
      if (this.Hours == "" || this.Hours == null) this.Hours = "0";
      if (this.Mins == "" || this.Mins == null) this.Mins = "0";

      // Remove left zeros
      this.Hours = parseInt(this.Hours).toString();
      this.Mins = parseInt(this.Mins).toString();

      // Mins can't be greater than 59
      if (parseInt(this.Mins) > 59)
        this.Mins = "59";
    }

    // Return mins if mode is duration
    if (this.isDuration) {
      // Hours and minutes are ready to be validated
      if (this.Hours.length == 1)
        this.Hours = "0" + this.Hours;

      if (this.Mins.length == 1)
        this.Mins = "0" + this.Mins;

      this.Time = ((parseInt(this.Hours) * 60) + parseInt(this.Mins)).toString();
      this.propagateChange(this.Time);
      this.onItemSelected.emit(this.Time);
      return;
    }

    // Validate input
    if (this.hourMode == AppEnums.HourMode.TwentyFour) {
      if (parseInt(this.Hours) > 24)
        this.Hours = "23";
    }
    else {
      if (parseInt(this.Hours) > 24) {
        this.Hours = "12";
        this.SelectedTimeFormat = TimeFormat.AM;
      }
      if (parseInt(this.Hours) > 12) {
        this.Hours = (parseInt(this.Hours) - 12).toString();
        this.SelectedTimeFormat = TimeFormat.PM;
      }
    }

    // Hours and minutes are ready to be validated
    if (this.Hours.length == 1)
      this.Hours = "0" + this.Hours;

    this.Time = this.replaceAt(0, this.Hours);

    if (this.Mins.length == 1)
      this.Mins = "0" + this.Mins;

    this.Time = this.replaceAt(3, this.Mins);

    if (this.SelectedTimeFormat == TimeFormat.PM) {
      if (parseInt(this.Hours) != 12)
        this.Time = this.replaceAt(0, (parseInt(this.Hours) + 12).toString());
    }

    if (this.SelectedTimeFormat == TimeFormat.AM) {
      if (parseInt(this.Hours) == 12)
        this.Time = this.replaceAt(0, "00");
    }


    // Pass time obj to parent component
    this.propagateChange(this.Time);
    this.onItemSelected.emit(this.Time);
    console.log(this.Time);
  }

  public ToggleAmPm(): void {
    if (this.disabled == false) {
      if (this.SelectedTimeFormat == TimeFormat.AM)
        this.SelectedTimeFormat = TimeFormat.PM;
      else
        this.SelectedTimeFormat = TimeFormat.AM;

      this.ValidateAndSelectTime();
    }
  }

  public replaceAt(index: number, replacement: string): string {
    return this.Time.substr(0, index) + replacement + this.Time.substr(index + replacement.length);
  }

  public IncrementOrDecrement(changeType: ChangeType, timeUnit: TimeUnit): void {
    if (this.Time == null)
      this.Time = "00:00:00";

    if (this.Hours == null || this.Hours == "")
      this.Hours = "00";

    if (this.Mins == null || this.Mins == "")
      this.Mins = "00";

    switch (changeType) {
      case ChangeType.Increment:
        if (timeUnit == TimeUnit.Hours) {
          if (this.hourMode == AppEnums.HourMode.TwentyFour) {
            if (parseInt(this.Hours) < 24)
              this.Hours = (parseInt(this.Hours) + 1).toString();
          }
          else {
            if (parseInt(this.Hours) < 12)
              this.Hours = (parseInt(this.Hours) + 1).toString();
          }
        }
        else {
          if (parseInt(this.Mins) < 59)
            this.Mins = (parseInt(this.Mins) + 1).toString();
        }
        break;
      case ChangeType.Decrement:
        if (timeUnit == TimeUnit.Hours) {
          if (parseInt(this.Hours) > 0)
            this.Hours = (parseInt(this.Hours) - 1).toString();
        }
        else {
          if (parseInt(this.Mins) > 0)
            this.Mins = (parseInt(this.Mins) - 1).toString();
        }
        break;
    }

    this.ValidateAndSelectTime();
  }

  public clearTime() {
    this.Hours = null;
    this.Mins = null;
    this.Time = null;
    this.SelectedTimeFormat = TimeFormat.AM;
    this.ValidateAndSelectTime();

  }
}
