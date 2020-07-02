import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';
import { AlertDialogComponent } from 'src/app/components/common/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  profileObs: Observable<any>;
  addresses: any;
  primaryAddress: any;

  // New Address
  address = {
    type: '',
    street: '',
    city: '',
    country: '',
    zipCode: '',
  };
  addressTypes = ['Home', 'Office', 'Billing', 'Other'];

  constructor(
    private profileService: ProfileService,
    private modalController: ModalController,
    public formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAddressInfo();
  }

  getAddressInfo() {
    this.profileObs = this.profileService.getUserProfile();
    this.subs.sink = this.profileObs.subscribe(res => {
      this.addresses = res.postals.data;
      console.log(this.addresses);
    });
  }

  addAddress() {
    this.subs.sink = this.profileService.addAddress(this.address).subscribe(res => {
      this.addresses.push(res);
    });

    this.address = {
      type: '',
      street: '',
      city: '',
      country: '',
      zipCode: '',
    };
  }
  deleteAddress(address) {
    this.showConfirmation('Do you want delete this address?').then(res => {
      if (res.data) {
        this.subs.sink = this.profileService.deleteAddress(address.postal_uuid).subscribe(res => {
          this.addresses = this.addresses.filter(x => x !== address);
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
