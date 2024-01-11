import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { AuthService } from 'app/service/auth.service';
import {
  catchError,
  finalize,
  firstValueFrom,
  from,
  lastValueFrom,
  Observable,
  of,
  skip,
  skipLast,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdminAuthService } from 'app/service/adminAuth.service';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {
  static isRefreshing = false;
  private API_ADMIN_URL = environment.API_ADMIN_URL;

  constructor(
    private adminAuthService: AdminAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = req.url.startsWith(this.API_ADMIN_URL)
      ? this.adminAuthService.accessToken
      : this.authService.accessToken;

    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    return next
      .handle(req)
      .pipe(catchError((x) => from(this.handleAuthError(x, req, next))));
  }

  private async handleAuthError(
    err: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    if (err.status === 401) {
      if (!JwtAuthInterceptor.isRefreshing) {
        console.log(`REFRESHING TOKEN [${req.url}]:`);
        JwtAuthInterceptor.isRefreshing = true;

        const refreshed = await this.authService.refreshToken();

        if (refreshed) {
          JwtAuthInterceptor.isRefreshing = false;
          const accessToken = this.authService.accessToken;
          console.log('ISPRAVAN:');
          console.log(accessToken);
          req = req.clone({
            setHeaders: {
              Authorization: 'Bearer ' + accessToken,
            },
          });

          return await lastValueFrom(next.handle(req));
        }
        JwtAuthInterceptor.isRefreshing = false;
      } else {
        console.log(`CANT REFRESH TOKEN [${req.url}]:`);
        let token = await this.awaitRefreshToken();
        console.log(token);
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
          },
        });

        return await lastValueFrom(next.handle(req));
      }
    }

    if (err.status === 403) {
      if (req.url.startsWith(this.API_ADMIN_URL))
        this.adminAuthService.logout();
      else {
        //Promena stanja Blocked u tokenu
        if (req.url.indexOf('refresh') == -1) {
          if (this.authService.blocked === false) {
            if (!JwtAuthInterceptor.isRefreshing) {
              JwtAuthInterceptor.isRefreshing = true;
              await this.authService.refreshToken();
              JwtAuthInterceptor.isRefreshing = false;
            }
          }
        }
      }

      this.router.navigate(['/'], {
        state: {
          message: err.error.error || err.error.message || 'Zabranjen pristup',
          status: 'alert-danger',
        },
      });
      throw err;
    }
    return await lastValueFrom(next.handle(req));
  }

  private async awaitRefreshToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.tokenSubject.pipe(skip(1)).subscribe({
        next: (x: any) => resolve(x),
        error: (err: any) => reject(null),
      });
    });
  }
}
