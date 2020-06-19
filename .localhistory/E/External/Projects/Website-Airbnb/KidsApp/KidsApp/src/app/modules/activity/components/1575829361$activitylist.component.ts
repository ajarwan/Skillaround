import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';
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

  @ViewChild('popCat', null) popCat: any;

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
    $("#mySlider").slider({
      range: true,
      min: 10,
      max: 999,
      values: [200, 500],
      slide: function (event, ui) {
        $("#price").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
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

    })
  }

  public SetSelectedCategory(cat: any) {
    this.Criteria.Category = cat;
    this.popCat.hide();
  }

  public test() {
    console.log(this.Criteria);
  }
}
