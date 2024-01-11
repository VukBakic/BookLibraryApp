import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordChangeValidator } from 'app/core/validators/password-confirm.validator';
import { AuthService } from 'app/service/auth.service';

import { UserService } from 'app/service/user.service';

@Component({
  selector: 'app-change-passowrd',
  templateUrl: './change-passowrd.component.html',
  styleUrls: ['./change-passowrd.component.scss'],
})
export class ChangePassowrdComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initListeners(this.passwordForm.controls);
  }

  passwordForm = this.fb.group(
    {
      password: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[^\\w]).{7,}$'
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[^\\w]).{7,}$'
          ),
        ],
      ],
    },
    { validators: passwordChangeValidator }
  );

  submitErrors: Array<{ field: string; message: string }> = [];
  errorMsg: string | null = null;

  isFieldValid(field: string) {
    return this.submitErrors.some((e) => e.field === field);
  }

  get passwordsMatch() {
    if (
      this.passwordForm.controls['newPassword'].hasError('pattern') ||
      this.passwordForm.controls['confirmPassword'].hasError('pattern')
    )
      return false;
    return (
      this.passwordForm.errors && 'passwordMatch' in this.passwordForm.errors
    );
  }
  onSubmit() {
    if (this.passwordForm.valid) {
      this.submitErrors = [];
      this.userService
        .changePassword(
          this.passwordForm.controls['password'].value,
          this.passwordForm.controls['newPassword'].value
        )
        .subscribe({
          next: (x) => {
            this.authService.logout();
            this.router.navigate([''], {
              state: {
                message:
                  'Uspesno ste promenili lozinku. Molim Vas ulogujte se ponovo.',
              },
            });
          },
          error: (e) => this.handleError(e),
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      let list = error.error.errors;

      this.submitErrors = list;

      let topOfElement = document.querySelector('.text-danger') as HTMLElement;
      topOfElement?.scrollIntoView();
    }
  }

  initListeners(control: any, parent?: string) {
    let path = parent ? parent + '.' : '';

    for (const field in control) {
      if (control[field] instanceof FormGroup) {
        this.initListeners(control[field].controls, path + field);
      } else {
        this.passwordForm
          .get(`${path}${field}`)
          ?.valueChanges.subscribe((x) => {
            if (this.submitErrors.length) {
              this.submitErrors = this.submitErrors.filter((obj) => {
                return obj.field !== `${path}${field}`;
              });
            }
          });
      }
    }
  }
}
