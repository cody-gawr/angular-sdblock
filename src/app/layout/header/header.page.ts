import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';

import { MenuComponent } from 'src/app/components/common/mobilemenu/mobilemenu.component';
import { NotificationComponent } from 'src/app/components/common/notification/notification.component';
import { UsermenuComponent } from 'src/app/components/common/usermenu/usermenu.component';

import { SharedService } from 'src/app/services/shared/shared';
import { AuthService } from 'src/app/services/account/auth';
import { ProfileService } from 'src/app/services/account/profile';
import { PanelService } from 'src/app/services/shared/panel';
import { NotificationService } from 'src/app/services/support/notification';
import { ProfileHeaderComponent } from 'src/app/components/common/profile-header/profile-header.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss']
})
export class HeaderPage implements OnInit, OnDestroy {
  // @ViewChild(NbPopoverDirective, { static: false }) popover: NbPopoverDirective;

  private subs = new SubSink();
  user: any;
  sidebar: any;
  historybarVisible: boolean;
  ticketbarVisible: boolean;
  currentPage = '';
  services: any[];
  assetUrl = environment.fileUrl;
  
  constructor(
    private router: Router,
    public authService: AuthService,
    public sharedService: SharedService,
    private dialogService: NbDialogService,
    public notificationService: NotificationService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private profileService: ProfileService,
    private panelService: PanelService,
  ) { }

  ngOnInit() {
    this.watchPanelStatus();
    this.watchRouter();
    this.getBasicUserInfo();
    this.getBasicUserServicesInfo();
  }

  watchRouter() {
    this.subs.sink = this.router.events.subscribe(val => {
      const urlSegs = this.router.url.split('?');
      const pathSegs = urlSegs[0].split('/').filter(value => value != '');
      this.currentPage = pathSegs[0];
    });
  }
  watchPanelStatus() {
    this.subs.sink = this.panelService.getTicketbarVisible().subscribe(res => {
      this.ticketbarVisible = res;
    });
    this.subs.sink = this.panelService.getHistorybarVisible().subscribe(res => {
      this.historybarVisible = res;
    });
  }

  getBasicUserInfo() {
    this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
      this.user = res;
    });
  }

  getBasicUserServicesInfo() {
    this.subs.sink = this.profileService.getBasicUserServicesInfo().subscribe(res => {
      this.services = res;
    });
  }


  checkReportPermission() {
    if (!this.services) { return false; }
    for (const service of this.services) {
      for (const permission of service.permissions) {
        if (permission.permission_name == 'App.Soundblock.Service.Report.Payments') {
          return true;
        }
      }
    }
    return false;
  }

  async showUsermenu(ev: any) {
    const modal = await this.modalController.create({
      component: MenuComponent,
      animated: true,
    });
    return await modal.present();
  }

  async showUserPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: UsermenuComponent,
      event: ev,
      translucent: true,
      showBackdrop: false,
    });
    return await popover.present();
  }
  
  showHideHistorySidebar() {
    if (this.historybarVisible) {
      this.panelService.hideHistoryBar();
    } else {
      this.panelService.showHistoryBar();
    }
  }
  showNotification() {
    this.dialogService.open(NotificationComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  showHideTicketbar() {
    this.panelService.setTicketbarVisible(!this.ticketbarVisible);
  }
  navigatePage(url: string) {
    this.router.navigate([`/${url}`]);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
