import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  location: Location;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  get accessToken(): string {
    return this.cookieService.get('access_token') || '';
  }

  get getRefreshToken(): string {
    return this.cookieService.get('refresh_token') || '';
  }

  get isAuthorized(): boolean {
    return Boolean(this.accessToken);
  }

  signUp(name: string, email: string, password: string, passwordConfirm: string, inviteHash?: string) {
    let url = `auth/signup`;
    if (inviteHash) {
      url = `soundblock/invite/${inviteHash}/signup`;
    }
    const req = { name_first: name, email, user_password: password, user_password_confirmation: passwordConfirm};
    return this.http.post<any>(url, req).pipe(map(res => {
      console.log({res});
      const data = res.data;
      this.cookieService.set('access_token', data.auth.access_token);
      this.cookieService.set('refresh_token', data.auth.refresh_token);
      return res.data;
    }));
  }

  signIn(user: string, password: string, inviteHash?: string) {
    let url = `auth/signin`;
    if (inviteHash) {
      url = `soundblock/invite/${inviteHash}/signin`;
    }
    const req = { user, password };
    return this.http.post<any>(url, req).pipe(map(res => {
      console.log({res});
      const data = res.data;
      this.cookieService.set('access_token', data.auth.access_token);
      this.cookieService.set('refresh_token', data.auth.refresh_token);
      return data;
    }));
  }

  signOut() {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    // location.reload();
    location.replace('auth/signin');
    // this.router.navigate(['auth/signin']);
  }

  checkPassword(pass) {
    const req = { current_password: pass };
    return this.http.post<any>(`auth/check-password`, req).pipe(map(res => {
      return res.response;
    }));
  }

  resetPassword(newPass, confirmPass) {
    const req = { new_password: newPass, confirm_password: confirmPass };
    return this.http.post<any>(`auth/reset-password`, req).pipe(map(res => {
      return res.response;
    }));
  }

  refreshToken() {
    const req = { refresh_token: this.getRefreshToken };
    return this.http.patch<any>(`auth/refresh`, req).pipe(map(res => {
      console.log('tokens', res);
      const response = res.data;
      this.cookieService.set('access_token', response.access_token);
      this.cookieService.set('refresh_token', response.refresh_token);
      return response;
    }));
  }

  sendMail(body: any) {
    return this.http.post(environment.apiUrl, body);
  }
}
