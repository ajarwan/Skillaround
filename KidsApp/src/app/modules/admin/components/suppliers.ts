import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import { UsersService } from '../../users/users.service';
import Swal from 'sweetalert2';
import { UserAttachmentsModal } from 'src/app/shared/components/users/userAttachmentsModal';

declare var $: any;

@Component({
  selector: 'admin-suppliers',
  templateUrl: './suppliers.html'
})
export class AdminSuppliers extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  @ViewChild('AttachmentsModal', null) AttachmentsModal: UserAttachmentsModal;


  public IsLoading: boolean = false;
  public Pager: Pager = new Pager(1, 6, 0, 0);

  public Suppliers: any = [];

  public Cri: any = {
    Types: [AppEnums.UserTypes.CompanySupplier, AppEnums.UserTypes.IndividualSupplier]
  }
  public Tempkeyword: any = '';
  /*************************************
   *  Constructor
   *************************************/
  constructor(public UsersSVC: UsersService) {
    super();
  }

  public ngOnInit() {


    DataStore.addUpdate('CurrentModule', AppEnums.Modules.Admin);

    if (!this.ActiveUser || this.ActiveUser.UserType != AppEnums.UserTypes.Manager)
      this.navigate('');

    this.LoadSuppliers()
  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadSuppliers() {

    this.IsLoading = true;
    this.UsersSVC.FindAllUsers(this.Cri, this.Pager.PageIndex, this.Pager.PageSize, null, null, false).subscribe((res: any) => {
      this.Suppliers = res.d;
      this.Pager = res.pager;
      this.IsLoading = false;
    })
  }

  public ToggleUserActiveStatus(user: any) {
    user.IsActive = !user.IsActive;

    user.IsLoading = true;

    this.UsersSVC.UpdateUser(user, false).subscribe((res: any) => {
      user.IsLoading = false;
    }, (err: any) => {
      user.IsLoading = false;
      user.IsActive = !user.IsActive;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    })
  }

  public ToggleVerification(user: any) {
    user.IsSupplierVerified = !user.IsSupplierVerified;

    user.IsLoading = true;

    this.UsersSVC.UpdateUser(user, false).subscribe((res: any) => {
      user.IsLoading = false;
    }, (err: any) => {
      user.IsLoading = false;
      user.IsSupplierVerified = !user.IsSupplierVerified;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      });
    })
  }




  public OnSerach() {

    this.Cri.Keyword = this.Tempkeyword;
    this.Pager.PageIndex = 1;

    this.LoadSuppliers();
  }

  public OpenAttachmentsModal(user: any) {

    this.AttachmentsModal.Open(user);

  }


  public OnPageChange(page: any) {
    this.Pager.PageIndex = page;
    this.LoadSuppliers();
  }

}
