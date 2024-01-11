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
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/service/admin.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,

    private router: Router,
    private route: ActivatedRoute
  ) {}

  USER_IMAGES_URL = environment.USER_IMAGES_URL;

  subscriptions: Subscription[] = [];
  id: string | null = null;

  avatarUrl: string | null = null;
  avatarFileName: string | null = null;
  submitErrors: Array<{ field: string; message: string }> = [];
  faFileUpload = faFileUpload;

  form = this.fb.group(
    {
      _id: [''],
      username: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      password: [
        '',
        [
          Validators.pattern(
            '^([A-Z](?=.*[a-z])|[a-z](?=.*[A-Z]))(?=.*\\d)(?=.*[^\\w]).{7,}$'
          ),
        ],
      ],
      passwordConfirmation: [''],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      avatar: [null],
      active: [true],
      type: ['user', [Validators.required]],
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
    this.id = this.route.snapshot.paramMap.get('id');
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

    this.adminService.getUser(this.id).subscribe({
      next: (val: any) => {
        this.form.patchValue(val);
        if (val.img_path) {
          this.avatarUrl = this.USER_IMAGES_URL + '/' + val.img_path;
        }
      },
    });
  }
  onSubmit() {
    this.submitErrors = [];
    if (this.form.valid) {
      let newUser = createForm(this.form.value);

      this.adminService.updateUser(newUser).subscribe({
        next: (data: any) => {
          this.router.navigate(['/admin/dashboard/change-status/', this.id], {
            state: { message: data.message },
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

  flashMessage: string | null = null;
  flashStatus = 'alert-danger';
  deleteUser() {
    this.adminService.deleteUser(this.id).subscribe({
      next: (val: any) => {
        this.router.navigate(['/admin/dashboard'], {
          state: { message: 'Korisnik je uspesno obrisan.' },
        });
      },
      error: (e: any) => {
        this.flashMessage = e.error;
      },
    });
  }
}
