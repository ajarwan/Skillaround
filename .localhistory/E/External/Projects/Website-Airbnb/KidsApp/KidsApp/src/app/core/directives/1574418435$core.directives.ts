import { Directive, HostListener, Renderer, ElementRef, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CoreEnums } from '../core.enums';


/*****************************
 *          Click
 *****************************/
@Directive({
  selector: '[appClick]',
  host: { '[class.pointer]': '!appDisabled', '[class.disabled]': 'appDisabled' }

})
export class APPClick {

  /*****************************
   *    Properties
   ****************************/
  private elem: HTMLElement;
  @Output() appClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() appDisabled: boolean = false;
  @Input() appResult: boolean = true;

  /*****************************
   *    Constructor
   ****************************/
  constructor(el: ElementRef) {
    this.elem = el.nativeElement;
  }

  /*****************************
   *    Methods
   ****************************/
  @HostListener('click', ['$event'])
  clickHandler(e: any): boolean {
    //Extend Session Timeout
    //this.coreService.refreshAge();


    //Check if Click Is Moved


    //check if disabled
    if (this.appDisabled) {
      e.stopPropagation();
      return;
    }

    //check if stop propagation
    if (e.currentTarget.attributes.stopPropagation) {
      e.stopPropagation();
    }

    this.appClick.emit(e);

    return this.appResult;
  }

}




/*****************************
*          Hidden
*****************************/
@Directive({
  selector: '[appHidden]',
  host: { '[class.app-hidden]': 'appHidden' }
})
export class APPHidden {
  /*****************************
   *          Members
   *****************************/
  @Input() appHidden: boolean;
  private elem: HTMLElement;


  /*****************************
   *          Constructor
   *****************************/
  constructor(el: ElementRef) {
    this.elem = el.nativeElement;
  }
}




/*****************************
*          Character Limit
*****************************/
@Directive({
  selector: '[appCharLimit]',
  providers: [NgModel],
  host: {
    '(keydown)': 'onValueChange($event)'
  }
})
export class AppCharLimit {
  /*****************************
   *          Members
   *****************************/
  @Input() appCharLimit: CoreEnums.CharLimit;
  private elem: HTMLElement;

  private enRegEx: RegExp = /^[^أ-ي]*$/;
  private arRegEx: RegExp = /^[^a-zA-Z]*$/;
  private digitsRegEx: RegExp = /^\d+$/;
  private positivenumbers: RegExp = /^\d*[1-9]\d*$/;
  private positivenumbersZ: RegExp = /^\d*[0-9]\d*$/;
  // private positiveFloat: RegExp = /^\d+(?:\.\d{1,3})?$/;

  private positiveFloat: RegExp = /^[+]?([.]\d+|\d+[.]?\d*)$/;



  /*****************************
   *          Constructor
   *****************************/
  constructor(el: ElementRef, private model: NgModel) {
    this.elem = el.nativeElement;
  }

  /*****************************
   *          Methods
   *****************************/

  onValueChange(e: any) {



    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.keyCode === 65 && e.metaKey === true) || // Cmd+A (Mac)
      (e.keyCode === 67 && e.metaKey === true) || // Cmd+C (Mac)
      (e.keyCode === 86 && e.metaKey === true) || // Cmd+V (Mac)
      (e.keyCode === 88 && e.metaKey === true) || // Cmd+X (Mac)
      (e.keyCode >= 35 && e.keyCode <= 39) // Home, End, Left, Right
    ) {
      return;  // let it happen, don't do anything
    }

    let value = e.target.value;
    let temp: any = "";

    switch (this.appCharLimit) {
      case CoreEnums.CharLimit.OnlyEnglish:
        if (!this.enRegEx.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.enRegEx.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;
      case CoreEnums.CharLimit.OnlyArabic:
        if (!this.arRegEx.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.arRegEx.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;
      case CoreEnums.CharLimit.OnlyNumbers:
        if (!this.digitsRegEx.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.digitsRegEx.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;
      case CoreEnums.CharLimit.PositiveNumbers:
        if (!this.positivenumbers.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.positivenumbers.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;
      case CoreEnums.CharLimit.PositiveNumbersZ:
        if (!this.positivenumbersZ.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.positivenumbersZ.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;
      case CoreEnums.CharLimit.PositiveFloat:
        if (!this.positiveFloat.test(e.key)) {
          e.preventDefault();
          for (var char of value) {
            if (this.positiveFloat.test(char))
              temp = temp + char;
          }
          this.updateModel(temp);
        }
        break;

    }
    //this.model.valueAccessor.writeValue(value);
  }

  updateModel(val: any) {
    // setTimeout(() => { this.model.update.emit(val) }, 10)
  }
}




/*****************************
*          Enter
*****************************/
@Directive({
  selector: '[appEnter]',
})
export class APPEnter {
  /*****************************
   *          Members
   *****************************/
  private elem: HTMLElement;
  @Output() appEnter: EventEmitter<any> = new EventEmitter<any>();


  /*****************************
   *          Constructor
   *****************************/
  constructor(el: ElementRef) {
    this.elem = el.nativeElement;
  }


  /*****************************
   *          Methods
   *****************************/
  @HostListener('keyup', ['$event'])
  keyEvent(e: any) {
    if (e.keyCode == 13) {
      this.appEnter.emit();
    }
  }

}


/*****************************
*          Image Error
*****************************/
@Directive({
  selector: '[appImageError]'
})
export class APPImageError implements OnInit {
  /*****************************
   *          Members
   *****************************/
  private elem: HTMLElement;
  public imageChanged = this.onImageChanged.bind(this);
  public handleError = this.OnhandleError.bind(this);

  private start: number = 0;
  @Input('appImageError') appImageError: string;

  private isChangedLocal: boolean = false;
  /*****************************
   *          Constructor
   *****************************/
  constructor(private element: ElementRef) {
    this.elem = element.nativeElement;
  }



  /*****************************
   *          Implementation
   *****************************/
  ngOnInit() {
    this.elem.removeEventListener("load", this.imageChanged);
    this.elem.removeEventListener("error", this.handleError);

    //Init By Error Image
    if (!(<HTMLImageElement>this.elem).src || (<HTMLImageElement>this.elem).src.indexOf('null') > -1)
      (<HTMLImageElement>this.elem).src = this.appImageError;

    this.start = new Date().getTime();
    //Handle Error
    switch (this.elem.tagName.toLowerCase()) {
      case 'img':
        //this.elem.onerror = () => { this.handleError() }
        //this.elem.onchange = () => { this.imageChanged() }
        this.elem.addEventListener("load", this.imageChanged);
        this.elem.addEventListener("error", this.handleError);
        break;
      default:
        throw new Error("appImageError Directive apply only to image tag.");
    }
  }


  /*****************************
   *          Methods
   *****************************/


  private OnhandleError() {


    this.isChangedLocal = true;
    (<HTMLImageElement>this.elem).src = this.appImageError;

    if (Math.abs(this.start - new Date().getTime()) > 10000) {
      this.elem.onerror = null;
    }

    //this.lastChecked = new Date().getTime();

  }

  public onImageChanged() {

    console.log("change image")
    if (this.isChangedLocal) {
      console.log("change image -- local")
      this.isChangedLocal = false;
      return;
    }
    this.ngOnInit();
  }

}







