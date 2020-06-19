import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'activity-list',
  templateUrl: './activitylist.component.html'
})
export class ActivityListComponent extends BaseComponent implements OnInit {

  /******************************************
   * Properties
   * ***************************************/
  public Criteria: any = {}
  public Categories: any[] = [];
  public MinPrice: any = 0;
  public MaxPrice: any = 0;

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
  }

  public test() {
    console.log(this.Criteria);
  }
}
