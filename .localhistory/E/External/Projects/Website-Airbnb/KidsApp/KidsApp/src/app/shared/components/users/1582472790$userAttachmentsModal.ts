import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { AppEnums } from 'src/app/app.enums';
import { SharedSubjects } from 'src/app/shared/service/shared.subjects';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/modules/users/users.service';

declare var $: any;

@Component({
  selector: 'shared-userattachmentsmodal',
  templateUrl: './userAttachmentsModal.html'
})
export class UserAttachmentsModal extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public modalOptions: NgbModalOptions;

  public IsLoading = false;
  public Documents: any[] = [];
  @ViewChild('UserAttachmentsModal', null) UserAttachmentsModal: any;
  /*************************************
   *  Constructor
   *************************************/
  constructor(public UsersSVC: UsersService,
    public modalService: NgbModal) {
    super();

  }

  public ngOnInit() {

    this.modalOptions = {
      backdrop: 'static',
      size: 'lg',
      centered: true
    }

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/

  public Open(user: any) {

    console.log(user);

    if (!user)
      return;


    this.IsLoading = true;

    this.modalService.open(this.UserAttachmentsModal, this.modalOptions).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.UsersSVC.FindAllDocuments({ UserId: user.Id }, -1, -1, "Id", null, false).subscribe((res: any) => {
      this.IsLoading = false;

      this.Documents = res.d;

    })


  }
}
