import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
    selector: 'app-loader',
    templateUrl: './app-loader.component.html'
})
export class AppLoader extends BaseComponent {

    /*****************************
   *    Constructor
   ****************************/
    constructor(private sharedSVC: SharedService) {
        super();
    }

    public Calls: any[] = [];
    get IsShown(): boolean {
        return this.Calls.length > 0;
    }

    public AddCall() {
        this.Calls.push(1);
    }

    public RemoveCall() {
        let me = this;

        setTimeout(() => {
            me.Calls.pop();
        }, 400);

    }

}
