import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @Output() upgrade = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  private subs = new SubSink();

  cardHandler = this.onChange.bind(this);

  storage = 'Simple';

  card: any;
  error: any;
  
  constructor(
    private cd: ChangeDetectorRef,
    private profileService: ProfileService
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.card = elements.create('card', {
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          lineHeight: '40px',
          fontWeight: 300,
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#aaaaaa'
          }
        }
      }
    });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  onCancel() {
    this.cancel.emit();
  }
  onSelectStorage(value) {
    this.storage = value;
  }

  async onUpgrade() {
    const {token, err} = await stripe.createToken(this.card);
    const { paymentMethod, error } = await stripe.createPaymentMethod(
        'card', this.card, {
            billing_details: { name: 'Yurii' }
        }
    );
    console.log(paymentMethod);
    if (error) {
      // Display "error.message" to the user...
      console.log({error});
      this.error = error.message;
    } else {
      console.log({paymentMethod});
      this.subs.sink = this.profileService.updateService(this.storage, paymentMethod.id).subscribe(res => {
        this.upgrade.emit();
      });
    }
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    this.subs.unsubscribe();
  }
}
