import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AdminAuthService } from 'app/service/adminAuth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AdminAuthService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.data['skip']) return true;
    let skip = state.root;

    while (skip.firstChild) {
      skip = skip.firstChild;
    }

    if (skip.data['skip']) return true;

    const currentUser = this.authService.user;
    if (currentUser) {
      return true;
    }
    const refreshed = await this.authService.refreshToken();
    console.log(refreshed);
    if (refreshed) return true;

    return this.router.parseUrl('/');
  }
}
