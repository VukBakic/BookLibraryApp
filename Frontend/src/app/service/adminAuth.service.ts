import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

import jwt_decode from 'jwt-decode';
import { BehaviorSubject, catchError, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private token: BehaviorSubject<string | null>;
  private API_URL = environment.API_URL;

  constructor(private router: Router, private http: HttpClient) {
    this.token = new BehaviorSubject<string | null>(
      localStorage.getItem('admin_access_token')
    );
  }

  get user() {
    return this.getDecodedAccessToken(this.token.value);
  }
  get accessToken() {
    return this.token.value;
  }

  private getDecodedAccessToken(token: string | null): any {
    try {
      const jwtData = jwt_decode(token as string) as any;
      if (Date.now() >= jwtData.exp * 1000) {
        return null;
      }
      return jwtData;
    } catch (Error) {
      return null;
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.API_URL}/admin/login`, {
        username,
        password,
      })
      .pipe(
        tap((data) => {
          this.token.next(data['access_token']);
          localStorage.setItem('admin_access_token', data['access_token']);
          localStorage.setItem('admin_refresh_token', data['refresh_token']);
        })
      );
  }

  logout() {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    this.token.next(null);
  }

  async refreshToken(): Promise<boolean> {
    const refresh_token: string | null = localStorage.getItem(
      'admin_refresh_token'
    );

    if (!refresh_token) {
      return false;
    }

    let isRefreshSuccess: boolean;
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${this.API_URL}/admin/refresh`, {
          token: refresh_token,
        })
      );

      const newToken = (<any>response).access_token;
      const newRefreshToken = (<any>response).refresh_token;
      this.token.next(newToken);
      localStorage.setItem('admin_access_token', newToken);
      localStorage.setItem('admin_refresh_token', newRefreshToken);
      console.log('Token refreshed!');
      isRefreshSuccess = true;
    } catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
