//Angular Imports
import { Component, ViewChild, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from 'src/app/core/core.base';
import { Pager } from '../classes/Pager';

//Evventa Imports

export enum PagerDotsMode {
    None = 1,
    RightSide = 2,
    LeftSide = 3,
    BothSides = 4
}


@Component({
    selector: 'shared-pager',
    templateUrl: './pager.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppPager),
            multi: true
        }
    ]
})
export class AppPager extends BaseComponent {

    /*****************************
    *      Properties
    *****************************/
    public PropagateChange = (_: any) => { };
    public PagerIndexes: Array<any>;
    public CurrentDotsMode: PagerDotsMode = PagerDotsMode.None;
    public DotsMode = PagerDotsMode;


    //Pager Getter And Setter
    public _pager: Pager;

    @Input() set pager(value: Pager) {

        this._pager = value;
        this.FillPagerIndexes();

    }
    get pager(): Pager {

        return this._pager;
    }


    @Output() OnPageChange: EventEmitter<any> = new EventEmitter<any>();

    /*****************************
    *      Constructor
    *****************************/

    constructor() {
        super();
    }

    /*****************************
    *      Implementations
    *****************************/

    onInit() {


    }
    afterViewInit() {

    }
    onDestroy() {

    }

    /*****************************
     *      Methods
     *****************************/

    public FillPagerIndexes() {

         if (!this.pager || this.pager.TotalPages <= 1) {
            this.PagerIndexes = [];
            return;
        }


        if (this.pager.TotalPages > 1 && this.pager.TotalPages <= 5) {
            this.PagerIndexes = Array(this.pager.TotalPages - 2).fill(1).map((x: any, i: any) => i + 2);
            this.CurrentDotsMode = PagerDotsMode.None;
        }
        else {
            //On Last Page
            if (this.pager.PageIndex <= 4) {
                this.PagerIndexes = Array(3).fill(1).map((x: any, i: any) => i + 2);
                this.CurrentDotsMode = PagerDotsMode.LeftSide;
            }
            else {
                if (this.pager.PageIndex == this.pager.TotalPages) {
                    this.PagerIndexes = [this.pager.PageIndex - 2, this.pager.PageIndex - 1];
                    this.CurrentDotsMode = PagerDotsMode.RightSide;
                }
                else if (this.pager.PageIndex + 1 == this.pager.TotalPages) {
                    this.PagerIndexes = [this.pager.PageIndex - 1, this.pager.PageIndex];
                    this.CurrentDotsMode = PagerDotsMode.RightSide;
                }
                else {
                    this.PagerIndexes = [this.pager.PageIndex - 1, this.pager.PageIndex, this.pager.PageIndex + 1];
                    this.CurrentDotsMode = PagerDotsMode.BothSides;
                }
            }
        }
    }

    public GoToPage(index: number) {

        if (!index ||
            this.pager.PageIndex == index ||
            index < 1 ||
            index > this.pager.TotalPages)
            return;

        this.pager.PageIndex = index;

        this.OnPageChange.emit(index);
    }


    writeValue(value: any) {
    }

    registerOnChange(fn: any) {
        this.PropagateChange = fn;
    }
    registerOnTouched(fn: any) {
        this.PropagateChange = fn;
    }


}
