import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'app/service/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.data['skip']) return true;
    /*
    let skip = state.root;

    while (skip.firstChild) {
      skip = skip.firstChild;
    }
    
    if (skip.data['skip']) return true;*/

    const role = route.data['role'];

    const currentUser = this.authService.user;

    let currentUserRole = currentUser?.role;

    if (Array.isArray(role)) {
      if (role.includes(currentUserRole)) return true;
    }
    
    if (currentUserRole == role) {
      return true;
    }

    return this.router.parseUrl('/');
  }
}
