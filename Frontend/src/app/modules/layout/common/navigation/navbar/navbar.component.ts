import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/service/auth.service';
import { environment } from 'environments/environment';
import { debounceTime, fromEvent, Subscription, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService, private router: Router) {}

  private eventSub: Subscription | null = null;
  USER_IMAGES_URL = environment.USER_IMAGES_URL;
  DEFAULT_USER_IMAGE = environment.DEFAULT_USER_IMAGE;

  role: string = 'guest';
  username: string | null = null;
  name: string | null = null;
  img_path: string | null = this.DEFAULT_USER_IMAGE;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const user = this.authService.user;

    if (user) {
      this.role = user.role;
      this.username = user.username;
      this.name = user.firstname + ' ' + user.lastname;
      this.img_path = user.img_path
        ? `${this.USER_IMAGES_URL}/${user.img_path}`
        : this.DEFAULT_USER_IMAGE;
    }
    this.eventSub = fromEvent(window, 'scroll')
      .pipe(
        debounceTime(100),
        tap((event) => this.onWindowScroll(event))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.eventSub?.unsubscribe();
  }
  onWindowScroll(event: Event): void {
    const navbar = document.getElementById('topnav');
    if (navbar != null) {
      if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
      ) {
        navbar.classList.add('nav-sticky');
      } else {
        navbar.classList.remove('nav-sticky');
      }
    }
  }
  toggleMenu(): void {
    document.getElementById('isToggle')?.classList.toggle('open');
    var isOpen = document.getElementById('navigation');
    if (isOpen?.style.display === 'block') {
      isOpen!.style.display = 'none';
    } else {
      isOpen!.style.display = 'block';
    }
  }
}
