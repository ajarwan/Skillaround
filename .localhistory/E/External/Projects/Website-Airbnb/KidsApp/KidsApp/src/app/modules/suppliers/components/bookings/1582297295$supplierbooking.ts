import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { SharedService } from 'src/app/shared/service/shared.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { Pager } from 'src/app/shared/classes/Pager';

declare var $: any;
declare var MtrDatepicker: any;

@Component({
  selector: 'suppliers-supplierbooking',
  templateUrl: './supplierbooking.html'
})
export class SupplierBooking extends BaseComponent implements OnInit, AfterViewInit {


  /******************************************
   * Properties
   * ***************************************/
  public Booking: any[] = []
  public BookingsPager: Pager = new Pager(1, 10, 0, 0);

  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private sharedSVC: SharedService) {
    super();

  }

  public ngOnInit() {
    this.LoadBokings()
  }

  public ngAfterViewInit() {

  }

  /*************************************
   *  Methods
   *************************************/
  public LoadBokings() {

  }
}
