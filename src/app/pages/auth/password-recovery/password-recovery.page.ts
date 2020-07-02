import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { SharedService } from 'src/app/services/shared/shared';
import { AuthService } from 'src/app/services/account/auth';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit, OnDestroy {
  private subs = new SubSink();

  step1 = false;
  step2 = false;
  step3 = false;
  passwordStrength = '';
  newPassword = '';
  email = '';
  code = '';
  regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() { }

  // Step 1
  sendEmail(email) {
    this.subs.sink = this.authService.sendMail(email).subscribe(resp => {
      console.log(resp);
    });
  }

  validateStep1() {
    console.log(this.regexp.test(this.email));
    if (this.regexp.test(this.email)) {
      this.step1 = true;
    }
  }

  // Step 2
  sendCode() { }

  validateStep2() {
    if (this.code.length > 3) {
      this.step2 = true;
    }
  }

  // Step 3
  validateStep3() {
    if (this.passwordStrength === 'Medium') {
      this.step3 = true;
    } else if (this.passwordStrength === 'Medium') {
      this.step3 = true;
    } else {
      this.step3 = false;
    }
  }

  onChangePassword() {
    this.passwordStrength = this.sharedService.checkPasswordStrength(
      this.newPassword
    );
    this.validateStep3();
  }
  changePassword() { }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
