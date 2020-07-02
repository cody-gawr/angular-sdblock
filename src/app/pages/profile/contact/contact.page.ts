import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Observable, empty } from 'rxjs';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';
import { AlertDialogComponent } from 'src/app/components/common/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit, OnDestroy {
  private subs = new SubSink();

  profileObs: Observable<any>;
  emails = [];
  phones = [];
  primaryPhone: any;
  primaryEmail: any;

  // New Contact Info
  type = '';
  phone = '';
  email = '';

  // Basic Data
  phoneTypes = ['Home', 'Cell', 'Work', 'Other'];
  emailRegEx = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-_]{1,}[.]{1}[a-zA-Z]{2,}/;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private modalController: ModalController,
    public formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.watchEmailVerifyToken();
    this.getContactData();
  }

  watchEmailVerifyToken() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.token) {
        console.log(queryParams.token);
        this.confirmEmailToken(queryParams.token);
      }
    });
  }
  getContactData() {
    this.profileObs = this.profileService.getUserProfile();
    this.subs.sink = this.profileObs.subscribe(profile => {
      this.emails = profile.emails.data;
      this.phones = profile.phones.data;
      this.primaryEmail = this.emails.find(x => x.flag_primary);
      this.primaryPhone = this.phones.find(x => x.flag_primary);
      console.log({profile});
      console.log(this.primaryEmail);
    });
  }

  // Email Section
  addEmail() {
    if (!this.emailRegEx.test(this.email)) {
      return;
    }
    this.subs.sink = this.profileService.addEmail(this.email).subscribe(res => {
      this.emails.push(res);
    });
    this.email = '';
  }
  setPrimaryEmail(email) {
    this.subs.sink = this.profileService.setPrimaryEmail(email.user_auth_email).subscribe(res => {
      this.emails = this.emails.map(x => {
        x.flag_primary = false;
        return x;
      });
      email.flag_primary = true;
    });
  }
  verifyEmail(email) {
    console.log({email});
    this.subs.sink = this.profileService.verifyEmail(email.email_uuid).subscribe(res => {
      console.log({res});
    });
  }
  confirmEmailToken(token) {
    this.subs.sink = this.profileService.confirmEmailHash(token).subscribe(res => {
      console.log({res});
      this.profileObs = this.profileService.getUserProfile();
    });
  }

  deleteEmail(email) {
    this.showConfirmation('Do you want delete this email?').then(res => {
      if (res.data) {
        this.subs.sink = this.profileService.deleteEmail(email.user_auth_email).subscribe(result => {
          console.log({result});
          this.emails = this.emails.filter(x => x !== email);
        });
      }
    });
  }

  // Phone Section
  addPhone() {
    if ( !this.phone || !this.type ) { return; }
    this.subs.sink = this.profileService.addPhone(this.type, this.phone, true).subscribe(res => {
      console.log({res});
      this.phones.push(res);
    });
    this.type = '';
    this.phone = '';
  }
  setPrimaryPhone(phone) {
    this.subs.sink = this.profileService.setPrimaryPhone(phone.phone_number).subscribe(res => {
      this.phones = this.phones.map(x => {
        x.flag_primary = false;
        return x;
      });
      phone.flag_primary = true;
    });
  }
  deletePhone(phone) {
    this.showConfirmation('Do you want delete this phone?').then(res => {
      if (res.data) {
        this.subs.sink = this.profileService.deletePhone(phone.phone_number).subscribe(result => {
          console.log({result});
          this.phones = this.phones.filter(x => x !== phone);
        });
      }
    });
  }

  async showConfirmation(message) {
    const modal = await this.modalController.create({
      component: AlertDialogComponent,
      componentProps: {
        title: 'Confirm',
        message,
        description: ''
      }
    });
    await modal.present();
    return modal.onDidDismiss();
  }

  navigate(step) {
    this.router.navigate([`/${step}`]);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
