import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, Subscription, throwError } from 'rxjs';

import { UserService } from 'app/service/user.service';

import { createForm } from 'app/core/utils/form-utils';
import { passwordConfirmValidator } from 'app/core/validators/password-confirm.validator';
import { UniqueUsernameValidator } from 'app/core/validators/username.validator';

import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private usernameValidator: UniqueUsernameValidator,
    private router: Router
  ) {}

  subscriptions: Subscription[] = [];

  avatarUrl: string | null = null;
  avatarFileName: string | null = null;
  submitErrors: Array<{ field: string; message: string }> = [];
  faFileUpload = faFileUpload;

  form = this.fb.group(
    {
      username: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [
            this.usernameValidator.validate.bind(this.usernameValidator),
          ],
          updateOn: 'blur',
        },
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[^\\w]).{7,}$'
          ),
        ],
      ],
      passwordConfirmation: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      avatar: [null],
    },
    { validators: passwordConfirmValidator }
  );
  formValidity = {
    username: true,
    password: true,
    passwordConfirmation: true,
    firstname: true,
    lastname: true,
    address: true,
    city: true,
    phone: true,
    email: true,
    avatar: true,
  };
  passwordMatchError: boolean | null = false;

  getControl(field: string): AbstractControl {
    return this.form.get(field) as AbstractControl;
  }
  ngOnInit(): void {
    for (const field in this.form.controls) {
      const control = this.getControl(field);

      this.subscriptions.push(
        control!.valueChanges.subscribe((value) => {
          this.formValidity[field as keyof typeof this.formValidity] =
            !control!.touched || control!.valid;

          if (this.submitErrors.length) {
            this.submitErrors = this.submitErrors.filter((obj) => {
              return obj.field !== field;
            });
          }
        })
      );
    }
    this.subscriptions.push(
      this.form.statusChanges.subscribe((value) => {
        this.passwordMatchError =
          this.form.errors &&
          'passwordMatch' in this.form.errors &&
          this.getControl('password').touched &&
          this.getControl('passwordConfirmation').touched;
      })
    );
    this.subscriptions.push(
      this.getControl('username').statusChanges.subscribe((value) => {
        this.formValidity['username'] = value === 'INVALID' ? false : true;
      })
    );
  }
  onSubmit() {
    this.submitErrors = [];
    if (this.form.valid) {
      let newUser = createForm(this.form.value);

      this.userService.register(newUser).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate([''], {
            state: { message: 'Uspesno ste se registrovali.' },
          });
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    } else {
      this.form.markAllAsTouched();

      for (const field in this.form.controls) {
        const control = this.getControl(field);
        this.formValidity[field as keyof typeof this.formValidity] =
          !control!.touched || control!.valid;
      }

      let topOfElement = document.querySelector(
        'input.ng-invalid'
      ) as HTMLElement;
      topOfElement?.scrollIntoView();
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      let list = error.error.errors;

      this.submitErrors = list;
      if (Array.isArray(list))
        list.forEach((element: any) => {
          this.formValidity[element.field as keyof typeof this.formValidity] =
            false;
        });

      let topOfElement = document.querySelector('.text-danger') as HTMLElement;
      topOfElement?.scrollIntoView();
    }
  }

  showPreview(fileList: FileList | null) {
    if (!fileList) return;
    const file = fileList[0];
    this.form.patchValue({
      avatar: file,
    });
    this.form.get('avatar')?.updateValueAndValidity();
    this.avatarFileName = file.name;

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onFieldBlur(event: Event): void {
    const field = (event!.target as Element).id;
    const fieldControl = this.getControl(field);
    this.formValidity[field as keyof typeof this.formValidity] =
      fieldControl.pending ? true : fieldControl.valid;

    if (field == 'password' || field == 'passwordConfirmation') {
      this.passwordMatchError =
        this.form.errors &&
        'passwordMatch' in this.form.errors &&
        this.getControl('password').touched &&
        this.getControl('passwordConfirmation').touched;
    }
  }
}
