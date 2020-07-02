import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

import { ProfileService } from 'src/app/services/account/profile';
@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  private subs = new SubSink();

  cardHandler = this.onChange.bind(this);

  storage = 'Simple';

  serviceName = '';
  card: any;
  error: any;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
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

  async onSubmit() {
    const {token, err} = await stripe.createToken(this.card);
    const { paymentMethod, error } = await stripe.createPaymentMethod(
      'card', this.card, { billing_details: { name: 'Yurii' } }
    );
    if (error) {
      // Display "error.message" to the user...
      console.log({error});
      this.error = error.message;
    } else {
      console.log({paymentMethod});
      this.subs.sink = this.profileService.createService(this.serviceName, this.storage, paymentMethod.id).subscribe(res => {
        console.log({res});
        this.router.navigate(['/auth/signup/2'], {queryParams: {plan: res.plan_type, confirm: res.payment}});
      });
    }
  }
  onSelectStorage(value) {
    this.storage = value;
  }
  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    this.subs.unsubscribe();
  }
}
