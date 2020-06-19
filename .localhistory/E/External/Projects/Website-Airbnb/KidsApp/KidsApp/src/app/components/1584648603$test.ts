import { BaseComponent } from '../core/core.base';
import { OnInit, Component } from '@angular/core';


declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.html'
})
export class Test extends BaseComponent implements OnInit {



  /*****************************
 *    Constructor
 ****************************/
  constructor() {
    super();


  }



  /*****************************
   *    Implementations
   ****************************/
  ngOnInit(): void {



  }








}
