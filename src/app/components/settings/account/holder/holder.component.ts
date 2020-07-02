import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss'],
})
export class HolderComponent implements OnInit, OnDestroy {
  @Input() account: any;
  @Output() upgrade = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();

  private subs = new SubSink();

  cancelMsg = '';
  cancelDesc = '';
  cancelType = 1;

  planType: string;
  accountType: any;

  constructor(
    private dialogService: NbDialogService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    if (this.account.plans) {
      this.accountType = 'Paid';
      this.planType = this.account.plans.data.plan_type;
      this.planType = this.planType.split(' ')[0];
    } else {
      this.accountType = 'Free';
    }
  }

  upgradeService() {
    this.upgrade.emit();
  }

  onDowngrade(ref) {
    this.cancelType = 1;
    this.cancelMsg = 'Are you sure you want to downgrade to Simple Block Storage?';
    this.cancelDesc = "You won't be able to add or edit files, except for music and video.";
    this.showDialog(ref);
  }

  onCancelService(ref) {
    this.cancelType = 2;
    this.cancelMsg = 'Are you sure you want to cancel? ';
    this.cancelDesc = "All of your files will become read-only. You will still have access to download your files, but any music or videos currently deployed to a platform will be removed..";
    this.showDialog(ref);
  }

  downgradeService(ref) {
    if (this.cancelType == 1) {
      // Downgrade service
      this.subs.sink =  this.profileService.updateService('Simple', this.account.payment.payment_id).subscribe(res => {
        console.log({res});
        this.update.emit();
      });
    } else {
      // Cancel Service
      this.subs.sink =  this.profileService.cancelService().subscribe(res => {
        console.log({res});
        this.update.emit();
      });
    }
    this.closeDialog(ref);
    
  }
  getBillingDate(planDay) {
    const curDate = new Date();
    const month = curDate.getMonth();
    const day = curDate.getDay();
    if (day < planDay) {
      curDate.setDate(planDay);
      return curDate;
    } else {
      curDate.setMonth(month + 1);
      return curDate;
    }
  }

  showDialog(ref) {
    this.dialogService.open(ref, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }
  closeDialog(ref: any) {
    ref.close();
  }

  ngOnDestroy() {
    
  }
}
