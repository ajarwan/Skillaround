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
  selector: 'admin-categories',
  templateUrl: './categories.html'
})
export class AdminCategorries extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Categories: any[] = [];

  public IsLoading: boolean = false;
  public IsLoadingTable: boolean = false;
  public keyWord: any = '';



  public Validations: any = {};
  public SelectedCat: any = {};

  public Icons: any[] = [
    { Icon: 'fas fa-book-reader', Img: 'reader.png' },
    { Icon: 'fas fa-futbol', Img: 'football.png' },
    { Icon: 'fas fa-campground', Img: 'camp.png' },
  ];

  get ActionsEnabled() {
    if (!this.Categories || this.Categories.length == 0)
      return false;

    if (this.Categories.some((x: any) => x.IsSelected))
      return false;

    return true;
  }
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
      ActivationStatus: AppEnums.ActivationStatus.All,
      Title: this.keyWord
    }
    this.AdminSVC.FindAllCategories(Cri, -1, -1, "CreateDate DESC", false).subscribe((res: any) => {
      this.Categories = res.d;
    })
  }

  public ToggleCatStatus(cat: any) {
    cat.IsActive = !cat.IsActive;
    this.IsLoadingTable = true;
    this.AdminSVC.UpdateCategory(cat, false).subscribe((res: any) => {
      this.IsLoadingTable = false;

    }, (err: any) => {
      this.IsLoadingTable = false;
      cat.IsActive = !cat.IsActive;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    })
  }

  public SetSelectedCat(cat: any) {
    this.Categories.forEach((x: any) => {
      x.IsSelected = false;
    })
    cat.IsSelected = true;

    let Icon = this.Icons.filter((x: any) => x.Icon == cat.IconClass)[0];
    this.SelectedCat = this.clone(cat);
    this.SelectedCat.Icon = Icon;

    this.Validations = {};



  }

  public OnCancel() {
    this.SelectedCat = {};
    this.Categories.forEach((x: any) => { x.IsSelected = false });
    this.Validations = {};
  }

  public OnSave() {
    if (!this.ValidateItem())
      return;

    this.IsLoading = true;
    this.SelectedCat.IconClass = this.SelectedCat.Icon.Icon;
    this.SelectedCat.ImageName = this.SelectedCat.Icon.Img;

    if (this.SelectedCat.Id) {
      this.AdminSVC.UpdateCategory(this.SelectedCat, false).subscribe((res: any) => {
        this.OnSuccess()
      }, (err: any) => this.OnError());
    }
    else {
      this.AdminSVC.AddCategory(this.SelectedCat, false).subscribe((res: any) => {
        this.OnSuccess()
      }, (err: any) => this.OnError());

    }
  }

  public ValidateItem() {
    this.Validations = {};

    if (Validator.StringIsNullOrEmpty(this.SelectedCat.TitleAr))
      this.Validations.TitleAr = true;

    if (Validator.StringIsNullOrEmpty(this.SelectedCat.TitleEn))
      this.Validations.TitleAr = true;

    if (!this.SelectedCat.Icon)
      this.Validations.Icon = true;

    if (Object.getOwnPropertyNames(this.Validations).length > 0)
      return false;

    return true;

  }

  public OnSuccess() {
    this.IsLoading = false;

    Swal.fire({
      icon: 'success',
      text: this.resources.SavedSuccessfully,
      showConfirmButton: true,
      confirmButtonText: this.resources.Acknowldge
    });

    this.LoadCategories();
  }

  public OnError() {
    this.IsLoading = false;
    Swal.fire({
      icon: 'error',
      text: this.resources.ErrorWhileSave,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    })

    this.LoadCategories();
  }


}
