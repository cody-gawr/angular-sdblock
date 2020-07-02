import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/services/account/auth';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from 'src/app/models/toast';

import * as _ from 'lodash';

const PUSHER_API_KEY = 'f88dc86a3f701150b191';
const PUSHER_CLUSTER = 'us2';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  echo: Echo;
  user: any;

  toastSubject: BehaviorSubject<Toast>;
  toastOptions = {
    autoClose: false,
    keepAfterRouteChange: false,
    showTime: 3000
  };

  perPage = 5;
  playSound = false;
  toastPosition = 'top-right';

  toastPositions = ['top-left', 'top-middle', 'top-right', 'middle-left', 'middle-middle', 'middle-right', 'bottom-left', 'bottom-middle', 'bottom-right'];
  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.initData();
  }

  initData() {
    this.toastSubject = new BehaviorSubject({...this.toastOptions});
  }

  updateSettings(setting) {
    console.log({setting});
    this.toastPosition = setting.position;
    this.playSound = setting.play_sound;
    this.perPage = setting.per_page;
    this.toastOptions.showTime = setting.show_time * 1000;
  }

  // Notifications

  getNotifications(page) {
    return this.http.get<any>(`user/notifications?per_page=${this.perPage}&page=${page}`).pipe(map(res => {
      return res;
    }));
  }

  archiveNotification(notifications) {
    const req = { notifications };
    return this.http.patch<any>(`user/notifications/archive`, req).pipe(map(res => {
      return res.data;
    }));
  }

  deleteNotification(notifications) {
    let params = new HttpParams();
    for (let i = 0; i < notifications.length; i ++) {
      params = params.append(`notifications[${i}]`, notifications[i]);
    }
    return this.http.delete<any>(`user/notifications`, {
      params
    }).pipe(map(res => {
      return res.data;
    }));
  }

  readNotification(notification) {
    return this.http.patch<any>(`user/notification/${notification}/read`, {}).pipe(map(res => {
      return res.data;
    }));
  }

  getNotificationSetting() {
    return this.http.get<any>(`user/notification/setting`).pipe(map(res => {
      const data = res.data;
      this.updateSettings(data.setting);
      return data;
    }));
  }

  saveNotificationSetting(settings) {
    return this.http.patch<any>(`user/notification/setting`, settings).pipe(map(res => {
      this.updateSettings(res.data.setting);
      return res.data;
    }));
  }

  sendNotification() {
    return this.http.get<any>(`user/notification/send`).pipe(map(res => {
      return res;
    }));
  }

  // Noteable events

  getNoteableEvents() {
    return this.http.get<any>(`soundblock/noteable`).pipe(map(res => {
      console.log(res);
      return res.data;
    }));
  }

  // Listen & Show Toast
  listen(user) {
    this.user = user;
    const pusher = new Pusher(PUSHER_API_KEY, {
      authEndpoint: `${environment.apiUrl}broadcasting/auth`,
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
      encrypted: true,
      auth: {
        params: {},
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`
        }
      },
    });
    const channel = pusher.subscribe('private-channel.app.soundblock.user.' + this.user.user_uuid);
    channel.bind('Notify.User.' + this.user.user_uuid, data => {
      this.showToast(data);
    });
  }

  onToast(): Observable<Toast> {
    return this.toastSubject.asObservable();
  }

  showToast(notification) {
    const toast = {id: Date.now(), notification, ...this.toastOptions};
    this.toastSubject.next(toast);
  }

  leaveChannel() {
    this.echo.leaveChannel(`private-channel.app.soundblock.user.${this.user.data.user_uuid}`);
  }
}
