//Angular Imports
import { Component, ViewChild, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { DataStore } from '../../core/services/dataStrore.service';
import { BaseComponent } from '../../core/core.base';
import { UsersService } from 'src/app/modules/users/users.service';
import { Pager } from '../classes/Pager';
import { AppEnums } from 'src/app/app.enums';


@Component({
  selector: 'shared-headernotification',
  templateUrl: './headernotification.html'
})
export class HeaderNotification extends BaseComponent implements OnInit {

  /*****************************
  *      Properties
  *****************************/
  public Notifications: any[] = [];
  public Pager: Pager = new Pager(1, 10, 0, 0);
  public Icludes: any[] = ['FromUser', 'MessagingQueue.FromUser', 'RelatedBooking.Activity', 'UserFriend.User'];


  public Cri: any = {
    Type: AppEnums.NotificationType.All,
    Status: AppEnums.SeenStatus.All
  }

  get Count() {
    return DataStore.get('NotificationsCount');
  }
  /*****************************
  *      Constructor
  *****************************/

  constructor(private userSVC: UsersService) {
    super();
    debugger;
  }

  /*****************************
  *      Implementations
  *****************************/

  onInit() {
    debugger;
    console.log('===Notification Header Initialized===')
    this.LoadNotifications();
  }
  afterViewInit() {

  }
  onDestroy() {

  }

  /*****************************
   *      Methods
   *****************************/
  public LoadNotifications() {

    this.userSVC.FindAllNotifications(this.Cri, this.Pager.PageIndex, this.Pager.PageSize, null, this.Icludes.join(','), false).subscribe((res: any) => {
      this.Notifications = res.d;
      this.Pager = res.pager;
    })
  }

}
