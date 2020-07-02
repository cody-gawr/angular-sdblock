import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { transition, state, animate, style, trigger} from '@angular/animations';
import { Router, NavigationStart } from '@angular/router';
import { SubSink } from 'subsink';
import { NotificationService } from 'src/app/services/support/notification';
import { Toast } from 'src/app/models/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('newTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('200ms', style({opacity: 0}))
      ]),
    ]),
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() id = 'default-toast';
  
  private subs = new SubSink();

  toasts: Toast[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.subs.sink = this.notificationService.onToast().subscribe(toast => {
      if (!toast.notification) {
        this.toasts = this.toasts.filter(x => x.keepAfterRouteChange);
        return;
      }

      this.toasts.unshift(toast);

      if (this.toasts.length > 3) {
        this.toasts.pop();
      }

      if (toast.autoClose) {
        setTimeout(() => {
          this.removeToast(toast);
        }, toast.showTime);
      }
    });
  }

  removeToast(toast: Toast) {
    if (!this.toasts.includes(toast)) { return; }

    this.toasts =  this.toasts.filter(x => x !== toast);

  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
