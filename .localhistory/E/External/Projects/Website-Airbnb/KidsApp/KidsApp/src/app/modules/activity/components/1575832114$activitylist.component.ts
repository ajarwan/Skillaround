import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
import { AppEnums } from 'src/app/app.enums';
declare var $: any;

@Component({
  selector: 'activity-list',
  templateUrl: './activitylist.component.html'
})
export class ActivityListComponent extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Criteria: any = {}
  public Categories: any[] = [];
  public MinPrice: any = 0;
  public MaxPrice: any = 0;

  public Ages: any[] = [
    { Title: '3-5 yrs', Id: 1, AgeFrom: 3, AgeTo: 5 },
    { Title: '6-9 yrs', Id: 2, AgeFrom: 6, AgeTo: 9 },
    { Title: '10-13 yrs', Id: 3, AgeFrom: 10, AgeTo: 13 },
    { Title: '14-16 yrs', Id: 4, AgeFrom: 14, AgeTo: 16 },
  ];
  @ViewChild('popCat', null) popCat: any;
  @ViewChild('popAge', null) popAge: any;

  /*************************************
   *  Constructor
   *************************************/
  constructor(public activitySVC: ActivityService,
    public adminSVC: AdminService) {
    super();
  }

  public ngOnInit() {
    this.LoadCategories();
    this.LoadPriceRange();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadCategories() {
    this.adminSVC.FindAllCategories(null).subscribe((res: any) => {
      this.Categories = res.d;
    })
  }

  public LoadPriceRange() {
    this.activitySVC.FindActivityPriceRange().subscribe((res: any) => {
      this.MinPrice = res.MinPrice;
      this.MaxPrice = res.MaxPrice;
      $("#price").val("$" + this.MinPrice + " - $" + this.MaxPrice);
    })
  }

  public SetSelectedCategory(cat: any) {
    this.Criteria.Category = cat;
    this.popCat.hide();
  }

  public OnPriceShown() {
    let me = this;
    $("#mySlider").slider({
      range: true,
      min: parseInt(this.MinPrice),
      max: parseInt(this.MaxPrice),
      values: [me.Criteria.MinPrice ? me.Criteria.MinPrice : this.MinPrice, me.Criteria.MaxPrice ? me.Criteria.MaxPrice : this.MaxPrice],
      slide: function (event, ui) {
        $("#price").val("$" + ui.values[0] + " - $" + ui.values[1]);

        me.Criteria.MaxPrice = ui.values[1];
        me.Criteria.MinPrice = ui.values[0];
      }
    });
  }

  public SetSelectedAge(age: any) {
    this.Criteria.Age = age;
    this.popAge.hide();
  }

  public GetTransLabel() {
    if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.All)
      return this.resources.TransportationAvailable + ' : ' + this.resources.All
    else if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.Available)
      return this.resources.TransportationAvailable + ' : ' + this.resources.Yes
    if (this.Criteria.TransportationStatus == AppEnums.TransportationFilter.NotAvailable)
      return this.resources.TransportationAvailable + ' : ' + this.resources.No
  }

  public test() {
    console.log(this.Criteria);
  }
}
