import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { SubSink } from 'subsink';
import { NbIconLibraries } from '@nebular/theme';

import { ProfileService } from 'src/app/services/account/profile';
import { AuthService } from 'src/app/services/account/auth';
import { SharedService } from 'src/app/services/shared/shared';
import { PanelService } from 'src/app/services/shared/panel';
import { NotificationService } from 'src/app/services/support/notification';

@Component({
  selector: 'app-root',
  templateUrl: 'ui.html',
  styleUrls: ['app.scss']
})
export class AppComponent implements OnDestroy {
  private subs = new SubSink();
  ticketbarVisible = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private iconLibraries: NbIconLibraries,
    public notificationService: NotificationService,
    private profileService: ProfileService,
    public sharedService: SharedService,
    public panelService: PanelService,
    public authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    this.registerFontPack();
    this.bootload();
  }

  registerFontPack() {
    this.iconLibraries.registerFontPack('font-awesome', {
      iconClassPrefix: 'fa'
    });
    this.iconLibraries.setDefaultPack('font-awesome'); // <---- set as default
  }

  bootload() {
    if (this.authService.isAuthorized) {
      this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
        this.notificationService.listen(res);
      });
    }
    this.watchTicketbarStatus();
  }

  watchTicketbarStatus() {
    this.subs.sink = this.panelService.getTicketbarVisible().subscribe(res => {
      this.ticketbarVisible = res;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
