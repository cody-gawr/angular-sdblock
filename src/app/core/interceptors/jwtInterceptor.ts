import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../../services/account/auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private platform: Platform,
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addHeader(request);
    if (this.authService.isAuthorized) {
      request = this.addToken(request, this.authService.accessToken);
    }
    // console.log({request});
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      console.log({request});
      if (request.url.includes('refresh') || !this.authService.getRefreshToken) {
        if (!window.location.href.includes('/auth/signin')) {
          this.authService.signOut();
        }
        return throwError(error);
      }

      if (request.url.includes('signin') || error.status !== 401) {
        return throwError(error);
      }
      return this.handle401Error(request, next);
      // return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('handle 401 error', this.isRefreshing);
    if (!this.isRefreshing) {
      console.log('is refreshing');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap( token => {
          console.log({token});
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(request, token.access_token));
        })
      );
    } else {
      console.log('new Call', this.refreshTokenSubject);
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return req;
  }

  private addHeader(req: HttpRequest<any>) {
    let headers = new HttpHeaders();
    headers = headers.append('Cache-Control', 'no-cache');
    headers = headers.append('X-API', 'v1.0');
    headers = headers.append('X-API-HOST', `App.Arena.Soundblock.${this.checkPlatform()}`);
    req = req.clone({
      url: environment.apiUrl + req.url,
      headers
    });
    return req;
  }

  checkPlatform() {
    if (this.platform.is('desktop')) {
      return 'Web';
    }
    if (this.platform.is('ios')) {
      return 'iOS';
    }
    if (this.platform.is('android')) {
      return 'Android';
    }
    return 'Web';
  }
}
