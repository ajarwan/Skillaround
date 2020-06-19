import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';



@Component({
  selector: 'user-mynetwork',
  templateUrl: './mynetwork.html'
})
export class MyNetwork extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public Pager: Pager = new Pager(1, 9, 0, 0);
  public Users: any[] = [];

  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService) {
    super();
  }

  public ngOnInit() {

    if (!this.ActiveUser) {
      this.navigate('/');
      return;

    }


    this.LoadData()

  }

  public ngAfterViewInit() {


  }

  /*************************************
   *  Methods
   *************************************/
  public LoadData() {
    this.userSVC.FindAllMyFriends(this.Pager.PageIndex, this.Pager.PageSize).subscribe((res: any) => {
      this.Users = res.d;
      this.Pager = res.pager;
    })
  }

  public OnPageChange(page: number) {
    this.Pager.PageIndex = page;
    this.LoadData();
  }

  public OnDeleteConfirm(userId: number) {

    Swal.fire({
      icon: 'question',
      text: this.resources.Areyousuretodisconnect,
    })


  }

}
