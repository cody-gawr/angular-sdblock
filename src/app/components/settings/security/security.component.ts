import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertDialogComponent } from 'src/app/components/common/alert-dialog/alert-dialog.component';
import { SharedService } from 'src/app/services/shared/shared';
import { AuthService } from 'src/app/services/account/auth';
import { SubSink } from 'subsink';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  curPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordStrength = '';
  validCurrentPassword = -1;

  assetUrl = environment.fileUrl;
  
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  checkCurrentPassword() {
    this.subs.sink = this.authService.checkPassword(this.curPassword).subscribe(res => {
      this.validCurrentPassword = res.data;
    });
  }

  changePassword() {
    this.subs.sink = this.authService.resetPassword(this.newPassword, this.confirmPassword).subscribe(res => {
      this.showMessage();
    });
  }

  changeNewPassword() {
    this.passwordStrength = this.sharedService.checkPasswordStrength(this.newPassword);
  }

  checkPasswordMatch() {

  }

  async showMessage() {
    const modal = await this.modalController.create({
      component: AlertDialogComponent,
      componentProps: {
        title: 'Reset Password',
        message: 'Your password has been reset',
        description: 'You can now sign in with your new password'
      }
    });
    return await modal.present();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
