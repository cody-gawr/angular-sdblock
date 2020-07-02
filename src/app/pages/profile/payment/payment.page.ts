import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable, empty } from 'rxjs';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  
  profileObs: Observable<any>;
  banks: any;
  paypals: any;


  // New Payment Info
  formType = 0;
  paypalEmail: any = '';
  bankForm: FormGroup;
  accountType = '';
  submitted = false;

  // Delete Payment Info
  deletePaymentInfo: any;
  deletePaymentType = '';

  emailRegEx = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-_]{1,}[.]{1}[a-zA-Z]{2,}/;

  assetUrl = environment.fileUrl;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.initData();
    this.getPaymentData();
  }

  getPaymentData() {
    this.profileObs = this.profileService.getUserProfile();
    this.subs.sink = this.profileObs.subscribe(profile => {
      this.banks = profile.bankings.data;
      this.paypals = profile.paypals.data;
    });
  }

  initData() {
    this.bankForm = this.formBuilder.group({
      bankName: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', Validators.required],
    });
    this.paypalEmail = '';
  }
  get bankformControls() { return this.bankForm.controls; }
  navigate(step) {
    this.router.navigate([`/${step}`]);
  }
  createPaypal() {
    if ( !this.paypalEmail || !this.emailRegEx.test(this.paypalEmail)) {
      this.submitted = true;
      return;
    }
    this.subs.sink = this.profileService.addPaypal(this.paypalEmail).subscribe(res => {
      this.paypals.push(res);
      this.submitted = false;
    });
    this.initData();
  }
  createAccount(form) {
    if (!form.valid) {
      this.submitted = true;
      return;
    }
    const bankAccount = {
      name: this.bankformControls.bankName.value,
      accountType: this.bankformControls.accountType.value,
      accountNumber: this.bankformControls.accountNumber.value + '',
      routingNumber: this.bankformControls.routingNumber.value,
    };
    this.subs.sink = this.profileService.addBankAccount(bankAccount).subscribe(res => {
      this.banks.push(res);
      this.submitted = false;
    });
    this.initData();
  }
  onSelectPayment(event) {
    console.log(event.detail.value);
    const payment = event.detail.value;
    this.subs.sink = this.profileService.setPrimaryPayment(payment).subscribe(res => {
      console.log({res});
      this.banks = this.banks.map(x => {
        x.flag_primary = false;
        return x;
      });
      this.paypals = this.paypals.map(x => {
        x.flag_primary = false;
        return x;
      });
      payment.flag_primary = true;
    });
  }
  deletePayment(ref) {
    if (this.deletePaymentType == 'bank') {
      this.subs.sink = this.profileService.deleteBankAccount(this.deletePaymentInfo.bank_uuid).subscribe(res => {
        this.banks = this.banks.filter(x => x !== this.deletePaymentInfo);
      });
    } else if (this.deletePaymentType == 'paypal') {
      this.subs.sink = this.profileService.deletePaypal(this.deletePaymentInfo.paypal_uuid).subscribe(res => {
        console.log({res});
        this.paypals = this.paypals.filter(x => x !== this.deletePaymentInfo);
      });
    }
    ref.close();
  }
  showForm(type) {
    this.formType = type;
  }
  delete(ref, info, type) {
    this.deletePaymentInfo = info;
    this.deletePaymentType = type;
    this.dialogService.open(ref, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  
  closeDialog(ref: any) {
    ref.close();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
