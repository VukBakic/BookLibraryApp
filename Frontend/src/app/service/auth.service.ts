import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

import jwt_decode from 'jwt-decode';
import { BehaviorSubject, catchError, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: BehaviorSubject<string | null>;
  private API_URL = environment.API_URL;

  private is_blocked;

  constructor(private router: Router, private http: HttpClient) {
    this.token = new BehaviorSubject<string | null>(
      localStorage.getItem('access_token')
    );

    this.is_blocked = this.user ? this.user.blocked : null;
  }

  get tokenSubject() {
    return this.token;
  }
  get blocked() {
    return this.is_blocked;
  }
  set blocked(val: boolean) {
    this.is_blocked = val;
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

      /* if (Date.now().valueOf() >= jwtData.exp * 1000) {
        return null;
      }*/
      return jwtData;
    } catch (Error) {
      return null;
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.API_URL}/user/login`, {
        username,
        password,
      })
      .pipe(
        tap((data) => {
          localStorage.setItem('access_token', data['access_token']);
          localStorage.setItem('refresh_token', data['refresh_token']);
          const jwtData = jwt_decode(data['access_token'] as string) as any;
          this.blocked = jwtData.blocked;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.token.next(null);
  }

  async refreshToken(): Promise<boolean> {
    const refresh_token: string | null = localStorage.getItem('refresh_token');

    if (!refresh_token) {
      return false;
    }

    let isRefreshSuccess: boolean;
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${this.API_URL}/user/refresh`, {
          token: refresh_token,
        })
      );

      const newToken = (<any>response).access_token;
      const newRefreshToken = (<any>response).refresh_token;
      this.token.next(newToken);
      localStorage.setItem('access_token', newToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      console.log('Token refreshed!');
      isRefreshSuccess = true;

      const jwtData = jwt_decode(newToken as string) as any;
      this.blocked = jwtData.blocked;
    } catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
