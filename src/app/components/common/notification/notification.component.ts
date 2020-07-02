import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { NotificationService } from 'src/app/services/support/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  notificationsObs: Observable<any>;
  notifications: any;
  settings: any;
  selectedTab = 1;
  toastPos = 'top-right';

  paginationInfo: any;

  toastPositions = [];

  expandFlag = [];
  checkedArr = [];
  checkedFlag = [];

  checkedAll = false;

  constructor(
    private modalController: ModalController,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.clearStatus();
    this.toastPositions = this.notificationService.toastPositions;
    this.getNotifications(1);
    this.subs.sink = this.notificationService.getNotificationSetting().subscribe(res => {
      this.settings = res;
    });
  }

  onRead(event, notification, index) {
    event.stopPropagation();
    this.notifications[index].notification_detail.notification_state = 'read';
    this.subs.sink = this.notificationService.readNotification(notification.notification_uuid).subscribe(res => {});
  }

  onArchive(event,notification) {
    event.stopPropagation();
    this.notifications = this.notifications.filter(x => x != notification);
    this.subs.sink = this.notificationService.archiveNotification([notification.notification_uuid]).subscribe(res => {});
  }

  onDelete(event,notification) {
    event.stopPropagation();
    this.notifications = this.notifications.filter(x => x != notification);
    this.subs.sink = this.notificationService.deleteNotification([notification.notification_uuid]).subscribe(res => {});
  }

  onBatchArchive() {
    this.notifications = this.notifications.filter(x => !this.checkedArr.includes(x.notification_uuid));
    this.subs.sink = this.notificationService.archiveNotification(this.checkedArr).subscribe(res => {});
    this.clearStatus();
  }

  onBatchDelete() {
    this.notifications = this.notifications.filter(x => !this.checkedArr.includes(x.notification_uuid));
    this.subs.sink = this.notificationService.deleteNotification(this.checkedArr).subscribe(res => {});
    this.clearStatus();
  }

  saveSetting() {
    console.log(this.settings);
    this.subs.sink =  this.notificationService.saveNotificationSetting(this.settings).subscribe(res => {});
  }

  getNotifications(page) {
    this.notificationsObs = this.notificationService.getNotifications(page);
    this.subs.sink =  this.notificationsObs.subscribe(res => {
      this.notifications = res.data;
      this.paginationInfo = res.meta.pages;
      this.clearStatus();
    });
  }

  checkNotification(event, noti, index) {
    event.stopPropagation();
    if (this.checkedFlag[index]) {
      this.checkedArr.push(noti.notification_uuid);
    } else {
      this.checkedArr = this.checkedArr.filter(x => x != noti.notification_uuid)
    }
  }

  onCheckAll() {
    this.checkedFlag.fill(this.checkedAll);
  }

  updateCheckedStatus() {
    for (let i = 0; i < this.notifications.length; i ++) {
      this.checkedFlag[i] = false;
      if (this.checkedArr.includes(this.notifications[i].notification_uuid)) {
        this.checkedFlag[i] = true;
      }
    }
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

  expandItem(index) {
    this.expandFlag[index] = !this.expandFlag[index];
  }

  selectToastPos(toastPos) {
    this.notificationService.toastPosition = toastPos;
    this.settings.user_setting.position = toastPos;
    this.saveSetting();
  }

  selectMobileToastPos(toastPos) {
    this.notificationService.toastPosition = `middle-${toastPos}`;
    this.settings.position = toastPos;
    this.saveSetting();
  }

  clearStatus() {
    this.expandFlag = new Array().fill(false);
    this.checkedFlag = new Array(5).fill(false);
    this.checkedArr = [];
  }

  close() {
    this.saveSetting();
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
