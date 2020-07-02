import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';

import { AuthService } from 'src/app/services/account/auth';
import { ProfileService } from 'src/app/services/account/profile';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.scss'],
})
export class UsermenuComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  user: any;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private router: Router,
    public authService: AuthService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.getBasicUserInfo();
  }

  getBasicUserInfo() {
    this.subs.sink = this.profileService.getBasicUserInfo().subscribe(res => {
      this.user = res;
    });
  }

  signOut() {
    this.popoverController.dismiss();
    this.authService.signOut();
  }

  async showNotification() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: NotificationComponent,
    });
    return await modal.present();
  }


  navigatePage(url: string) {
    this.popoverController.dismiss();
    this.router.navigate([`/${url}`]);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
