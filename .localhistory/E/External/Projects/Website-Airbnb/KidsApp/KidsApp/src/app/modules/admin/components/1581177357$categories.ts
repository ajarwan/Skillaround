import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'admin-categories',
  templateUrl: './categories.html'
})
export class AdminCategorries extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Categories: any[] = [];

  public IsLoading: boolean = false;

  /*************************************
   *  Constructor
   *************************************/
  constructor(public AdminSVC: AdminService) {
    super();

  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadCategories();
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadCategories() {
    let Cri: any = {
      ActivationStatus: AppEnums.ActivationStatus.All
    }
    this.AdminSVC.FindAllCategories(Cri, -1, -1, "CreateDate DESC", false).subscribe((res: any) => {
      this.Categories = res.d;
    })
  }

  public ToggleCatStatus(cat: any) {
    cat.IsActive = !cat.IsPosted;
    cat.IsLoading = true;
    this.AdminSVC.UpdateCategory(cat, false).subscribe((res: any) => {
      cat.IsLoading = false;

    }, (err: any) => {
      cat.IsLoading = false;
      cat.IsPosted = !cat.IsPosted;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    })
  }


}
