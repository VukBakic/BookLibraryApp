import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/service/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-config.component.html',
  styleUrls: ['./edit-config.component.scss'],
})
export class EditConfigComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  submitErrors: Array<{ field: string; message: string }> = [];
  subscriptions: Subscription[] = [];
  form = this.fb.group({
    daysToReturn: ['', Validators.required],
    daysToExtend: ['', Validators.required],
  });
  flashMessage: string | null = null;
  flashStatus = 'alert-success';

  formValidity = {
    daysToReturn: true,
    daysToExtend: true,
  };
  getControl(field: string): AbstractControl {
    return this.form.get(field) as AbstractControl;
  }
  ngOnInit(): void {
    this.adminService.getConfig().subscribe({
      next: (val: any) => {
        this.form.patchValue(val);
      },
    });

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
  }
  onSubmit(): void {
    this.submitErrors = [];
    if (this.form.valid) {
      this.adminService.updateConfig(this.form.value).subscribe({
        next: (data: any) => {
          this.flashMessage = 'Uspesno ste azurirali podesavanja.';
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

  onFieldBlur(event: Event): void {
    const field = (event!.target as Element).id;
    const fieldControl = this.getControl(field);
    this.formValidity[field as keyof typeof this.formValidity] =
      fieldControl.pending ? true : fieldControl.valid;
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
