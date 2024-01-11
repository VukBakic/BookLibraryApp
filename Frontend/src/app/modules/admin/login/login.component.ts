import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from 'app/service/adminAuth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private adminAuthService: AdminAuthService,
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
    this.adminAuthService
      .login(this.loginForm.value['username'], this.loginForm.value['password'])
      .subscribe({
        error: (e: any) => (this.errorMsg = e.error.error),
        complete: () => {
          this.router.navigate(['/admin/dashboard'], {
            state: { message: 'Uspesno ste se ulogovali.' },
          });
        },
      });
  }
}
