import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'activity-list',
  templateUrl: './activitylist.component.html'
})
export class ActivityListComponent extends BaseComponent implements OnInit {


  public Criteria: any = {}
  public Categories: any[] = [];


  constructor(public adminSVC: AdminService) {
    super();
  }


  public ngOnInit() {
    this.LoadCategories();
  }



  public LoadCategories() {
    this.adminSVC.FindAllCategories(null).subscribe((res: any) => {
      this.Categories = res.d;

      this.Categories.unshift({ TitleAr: 'ألتصنيف', TitleEn: 'Category', Id: -1 });
    })
  }




  public test() {
    console.log(this.Criteria);
  }
}
