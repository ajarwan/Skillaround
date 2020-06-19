import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { Validator } from 'src/app/core/services/validator';

declare var $: any;

@Component({
  selector: 'admin-about',
  templateUrl: './aboutAdmin.html'
})
export class AboutAdmin extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public IsLoading: boolean = false;
  public InvalidAr: boolean = false;
  public InvalidEn: boolean = false;
  public AdminContent: any = {};

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
    else
      this.LoadData()
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {
    this.IsLoading = true;
    this.AdminSVC.FindContentAdminByType(AppEnums.ContentAdminType.AboutUs, false).subscribe((res: any) => {
      if (res)
        this.AdminContent = res;
      else
        this.AdminContent = {
          Type: AppEnums.ContentAdminType.AboutUs
        };
      this.IsLoading = false;
    })

  }

  public OnSave() {

    if (!this.AdminContent.ContentAr || Validator.RichTextboxIsNullOrEmpty(this.AdminContent.ContentAr)) {
      this.InvalidAr  = true;
      return;
    }

    if (!this.AdminContent.ContentEn || Validator.RichTextboxIsNullOrEmpty(this.AdminContent.ContentEn)) {
      this.InvalidEn = true;
      return;
    }

    this.InvalidAr = false;
    this.InvalidEn = false;

    this.IsLoading = true;
    this.AdminSVC.UpdateContentAdmin(this.AdminContent, false).subscribe((res: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'success',
        text: this.resources.SavedSuccessfully,
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: this.resources.Ok
      });
    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorInSystem,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    });
  }
}
