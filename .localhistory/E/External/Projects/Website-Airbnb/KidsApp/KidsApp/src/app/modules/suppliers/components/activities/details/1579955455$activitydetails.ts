import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { Pager } from 'src/app/shared/classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import { environment } from 'src/environments/environment';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { Validator } from 'src/app/core/services/validator';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/modules/users/users.service';
import { ActivityService } from 'src/app/modules/activity/activity.service';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare var google: any;

@Component({
  selector: 'suppliers-activitydetails',
  templateUrl: './activitydetails.html'
})
export class ActivityDetails extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
  * Properties
  * ***************************************/
  public ActivityId: number = null;
  public Activity: any = {};
  public ActivityIncludes: any[] = ['Category'];


  public IsLoading: boolean = false;




  /*************************************
   *  Constructor
   *************************************/
  constructor(private userSVC: UsersService,
    private activitySCV: ActivityService,
    private adminSVC: AdminService,
    private route: ActivatedRoute) {
    super();

  }

  public ngOnInit() {

    DataStore.addUpdate('SupplierMasterSearchShown', false);
    DataStore.addUpdate('SupplierModulePageTitle', this.resources.ActivityDetails);

    this.ActivityId = this.route.snapshot.params['id'];
    if (this.ActivityId)
      this.LoadActivityDetails()
    else
      this.navigate('supplier/activities');
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadActivityDetails() {
    this.IsLoading = true;
    this.activitySCV.FindActivityById(this.ActivityId, this.ActivityIncludes.join(','), false).subscribe((res: any) => {
      if (!res || res.SupplierId != this.ActiveUser.Id)
        this.navigate('supplier/activities');

      this.Activity = res;
      this.IsLoading = false;

      this.activitySCV.FindAllActivityDocuments(this.ActivityId, false).subscribe((res: any) => {

        this.Activity.Documents = res.d;

      });

    }, (err: any) => {
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((respones: any) => {
        this.navigate('supplier/activities');
      })
    });

  }
}
