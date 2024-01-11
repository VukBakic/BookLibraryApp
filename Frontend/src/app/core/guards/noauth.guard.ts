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
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.user;
    if (!currentUser) {
      const refreshed = await this.authService.refreshToken();
      if (refreshed) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    }

    const stateToReturn = this.router.getCurrentNavigation()
      ?.extras as NavigationExtras;

    console.log(this.router.getCurrentNavigation());
    this.router.navigate(['/dashboard'], { state: stateToReturn.state });
    return false;
  }
}
