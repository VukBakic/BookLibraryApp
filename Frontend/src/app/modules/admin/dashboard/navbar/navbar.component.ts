import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowRightFromBracket,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons';

import { AdminAuthService } from 'app/service/adminAuth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  faUsersGear = faUsersGear;
  faArrowRightFromBracket = faArrowRightFromBracket;
  ngOnInit(): void {}

  logout() {
    this.adminAuthService.logout();
    this.router.navigate(['/']);
  }
}
