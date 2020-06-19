//Angular Imports
import { Component, ViewChild, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { DataStore } from '../../core/services/dataStrore.service';
import { BaseComponent } from '../../core/core.base';
import { UsersService } from 'src/app/modules/users/users.service';
import { Pager } from '../classes/Pager';
import { AppEnums } from 'src/app/app.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;


@Component({
  selector: 'shared-headernotification',
  templateUrl: './headernotification.html'
})
export class HeaderNotification extends BaseComponent implements OnInit {

  /*****************************
  *      Properties
  *****************************/
  @ViewChild('MessageModal', null) MessageModal: any;
  public modalOptions: any = {};
  public DisplayText: any = '';

  public Notifications: any[] = [];
  public Pager: Pager = new Pager(1, 10, 0, 0);
  public Icludes: any[] = ['FromUser', 'MessagingQueue.FromUser', 'RelatedBooking.Activity.Thumbnail', 'UserFriend.User'];

  public SelectedNotification: any = {};

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

  constructor(private userSVC: UsersService,
    public modalService: NgbModal) {
    super();
    this.modalOptions = {
      backdrop: 'static',
      size: 'lg',
      centered: true
    }
  }

  /*****************************
  *      Implementations
  *****************************/

  ngOnInit() {
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
      let tempResults = res.d;
      this.Pager = res.pager;
      this.Notifications = this.userSVC.MapNotification(tempResults)
    })
  }

  public OnConnectAction(notification: any, status: AppEnums.AcceptStatus) {
    notification.HideAction = true;
    notification.UserFriend.AcceptStatus = status
    this.userSVC.UpdateUserFriend(notification.UserFriend, false).subscribe((res: any) => {
    }, (err: any) => { notification.HideAction = false });
  }

  public OnNotificationClick(notification: any) {

    this.SelectedNotification = notification;
    if (notification.Type == AppEnums.NotificationType.SystemNotification
      || notification.Type == AppEnums.NotificationType.UserMessage) {
      if (notification.Type == AppEnums.NotificationType.UserMessage)
        this.DisplayText = notification.MessagingQueue.Message;

      //Temp Close Notifications drop down
      $('body').click();
      this.modalService.open(this.MessageModal, this.modalOptions).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }


  public SetNotificationsSeen() {
    this.userSVC.SetSeenNotification().subscribe((res: any) => {
      DataStore.addUpdate('NotificationsCount', 0);
    });

  }
}
