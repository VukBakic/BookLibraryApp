import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras,
} from '@angular/router';
import { AuthService } from 'app/service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ) {
    /*
    if (route.data['skip']) return true;
    let skip = state.root;

    while (skip.firstChild) {
      skip = skip.firstChild;
    }

    if (skip.data['skip']) return true;
    */

    const currentUser = this.authService.user;

    if (currentUser) {
      return true;
    }

    const refreshed = await this.authService.refreshToken();

    if (refreshed) return true;

    const { state } = this.router.getCurrentNavigation()
      ?.extras as NavigationExtras;

    let url = state ? (state['redirect'] ? state['redirect'] : '/') : '/';

    return this.router.parseUrl(url);
  }
}
