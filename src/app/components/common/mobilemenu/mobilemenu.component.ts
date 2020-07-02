import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';

import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from 'src/app/services/support/notification';
import { SharedService } from 'src/app/services/shared/shared';
import { ProfileService } from 'src/app/services/account/profile';
import { AuthService } from 'src/app/services/account/auth';
import { PanelService } from 'src/app/services/shared/panel';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  user: any;
  avatarPath = `${environment.fileUrl}/images/user.png`;
  notifications: any;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  assetUrl = environment.fileUrl;

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private modalController: ModalController,
    private panelService: PanelService,
    public authService: AuthService,
    private profileService: ProfileService,
    public sharedService: SharedService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getBasicUserInfo();
    this.subs.sink = this.notificationService.getNotifications(1).subscribe(res => {
      this.notifications = res.data;
      console.log(this.notifications);
    });
  }

  wifiSetting() {
    // code for setting wifi option in apps
  }

  getBasicUserInfo() {
    this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
      this.user = res;
    });
  }

  signOut() {
    // code for logout
    this.close();
    this.authService.signOut();
  }

  navigate(url: string) {
    this.close();
    this.router.navigate([url]);
  }
  showNotification() {
    this.dialogService.open(NotificationComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  showTicketbar() {
    this.panelService.setTicketbarVisible(true);
  }

  close () {
    this.modalController.dismiss();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
