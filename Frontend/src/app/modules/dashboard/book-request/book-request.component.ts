import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { createForm } from 'app/core/utils/form-utils';
import { UserService } from 'app/service/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-request',
  templateUrl: './book-request.component.html',
  styleUrls: ['./book-request.component.scss'],
})
export class BookRequestComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  subscriptions: Subscription[] = [];
  authorSubs: Subscription[] = [];

  imageUrl: string | null = null;
  imageFileName: string | null = null;

  submitErrors: Array<{ field: string; message: string }> = [];
  faFileUpload = faFileUpload;

  genres: any = [];

  authorFormsCount = 0;
  form = this.fb.group({
    name: ['', [Validators.required]],
    author: this.fb.array([], [Validators.required]),
    genre: [[], [Validators.required]],
    publisher: ['', [Validators.required]],
    year: ['', [Validators.required]],
    language: ['', [Validators.required]],
    count: [1],
    image: [null],
  });

  formValidity: { [key: string]: any } = {
    name: true,
    author: [true, true, true],
    publisher: true,
    year: true,
    language: true,
    image: true,

    genre: true,
  };
  authorError: string | undefined = undefined;

  get author() {
    return this.form.get('author') as FormArray;
  }

  deleteAuthorForm(index: number) {
    this.author.removeAt(index);
    this.authorSubs[index].unsubscribe();
    this.authorFormsCount--;
  }
  addAuthorForm() {
    this.authorFormsCount++;
    this.authorError = undefined;
    const authorForm = this.fb.control('', Validators.required);

    let index = this.author.length;
    this.author.push(authorForm);

    this.authorSubs[index] = authorForm.valueChanges.subscribe((value) => {
      this.formValidity['author'][index] =
        !authorForm!.touched || authorForm!.valid;

      if (this.submitErrors.length) {
        this.submitErrors = this.submitErrors.filter((obj) => {
          return obj.field !== 'author.' + index;
        });
      }
    });
  }

  ngOnInit(): void {
    this.addAuthorForm();
    for (const field in this.form.controls) {
      if (field == 'author') continue;

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
    this.userService.getGenres().subscribe({
      next: (val: any) => {
        this.genres = [...val];
      },
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.authorSubs.forEach((sub) => sub.unsubscribe());
  }
  onSubmit(): void {
    this.submitErrors = [];
    if (this.form.valid) {
      let newData = createForm(this.form.value);

      this.userService.addBookRequest(newData).subscribe({
        next: (data: any) => {
          this.router.navigate(['/'], {
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
        if (field == 'author') {
          this.author.controls.forEach((ctrl, i) => {
            this.formValidity['author'][i] = !ctrl!.touched || ctrl!.valid;
          });
        } else
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
          if (element.field == 'author') {
            this.authorError = element.message;
          } else if (element.field.match(/author.\d/g)) {
            try {
              let index = parseInt(element.field.split('.')[1]);
              this.formValidity['author'][index] = false;
            } catch (e: any) {
              console.log(e);
            }
          } else
            this.formValidity[element.field as keyof typeof this.formValidity] =
              false;
        });

      let topOfElement = document.querySelector('.text-danger') as HTMLElement;
      topOfElement?.scrollIntoView();
    }
  }
  getControl(field: string): AbstractControl {
    return this.form.get(field) as AbstractControl;
  }

  onFieldBlur(event: Event): void {
    const field = (event!.target as Element).id;
    const fieldControl = this.getControl(field);
    this.formValidity[field as keyof typeof this.formValidity] =
      fieldControl.pending ? true : fieldControl.valid;
  }

  showPreview(fileList: FileList | null) {
    if (!fileList) return;
    const file = fileList[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get('image')?.updateValueAndValidity();
    this.imageFileName = file.name;

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
