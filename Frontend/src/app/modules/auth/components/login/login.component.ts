import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  errorMsg: string | null = null;

  onSubmit() {
    this.errorMsg = null;
    this.authService
      .login(this.loginForm.value['username'], this.loginForm.value['password'])
      .subscribe({
        error: (e) => (this.errorMsg = e.error.error),
        complete: () => {
          this.router.navigate(['/dashboard'], {
            state: { message: 'Uspesno ste se ulogovali.' },
          });
        },
      });
  }
}
