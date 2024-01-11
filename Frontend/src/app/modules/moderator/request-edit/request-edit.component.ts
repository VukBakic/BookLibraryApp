import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { createForm } from 'app/core/utils/form-utils';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';
import { delay, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-request-edit',
  templateUrl: './request-edit.component.html',
  styleUrls: ['./request-edit.component.scss'],
})
export class RequestEditComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  subscriptions: Subscription[] = [];
  authorSubs: Subscription[] = [];

  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;

  imageUrl: string | null = null;
  imageFileName: string | null = null;

  submitErrors: Array<{ field: string; message: string }> = [];
  faFileUpload = faFileUpload;

  imgCover: string | null = null;
  genres: any = [];

  taken = 0;

  id: string | null = null;
  authorFormsCount = 0;
  form = this.fb.group({
    _id: [''],
    name: ['', [Validators.required]],
    author: this.fb.array([], [Validators.required]),
    genre: [[], [Validators.required]],
    publisher: ['', [Validators.required]],
    year: ['', [Validators.required]],
    language: ['', [Validators.required]],
    count: ['', [Validators.required, Validators.min(1)]],
    image: [null],
  });

  formValidity: { [key: string]: any } = {
    name: true,
    author: [true, true, true],
    publisher: true,
    year: true,
    language: true,
    image: true,
    count: true,
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

  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  ngOnInit(): void {
    const message = history.state.message;
    this.flashMessage = message;
    this.flashStatus = history.state.status
      ? history.state.status
      : this.flashStatus;

    this.id = this.route.snapshot.paramMap.get('id');

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
    this.userService.getReqBook(this.id).subscribe({
      next: (val: any) => {
        val.genre = val.genre.map((e: any) => e._id);
        val.author.forEach((e: any) => this.addAuthorForm());
        this.imgCover = val.img_path;
        this.form.patchValue(val);
        this.taken = val.taken;
      },
    });
  }
  ngOnDestroy() {
    console.log('destroy');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.authorSubs.forEach((sub) => sub.unsubscribe());
  }

  updateBook() {
    this.userService.getReqBook(this.id).subscribe({
      next: (val: any) => {
        val.genre = val.genre.map((e: any) => e._id);
        this.imgCover = null;

        ((): Observable<string> => {
          return of(val.img_path);
        })()
          .pipe(delay(100))
          .subscribe((val) => {
            this.imgCover = val;
          });

        this.form.patchValue(val);
      },
    });
  }

  onSubmit(): void {
    this.submitErrors = [];
    if (this.form.valid) {
      let newData = createForm(this.form.value);

      this.userService.updateBook(newData).subscribe({
        next: (data: any) => {
          this.router.navigate(['../dashboard/moderator/requests'], {
            state: { message: 'Uspesno ste odobrili zahtev.' },
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
          if (this.author.controls.length == 0)
            this.authorError = 'Morate uneti bar jednog autora.';
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

  deleteReq(): void {
    this.userService.deleteBook({ _id: this.id }).subscribe({
      next: (data: any) => {
        this.router.navigate(['../dashboard/moderator/requests'], {
          state: { message: 'Uspesno ste obrisali zahtev.' },
        });
      },
      error: (err) => {
        console.log(err);
        this.handleError(err);
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      let list = error.error.errors;
      if (!list) {
        this.flashMessage = error.error;
      }
      {
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
              this.formValidity[
                element.field as keyof typeof this.formValidity
              ] = false;
          });
      }
      let topOfElement = document.querySelector('.text-danger') as HTMLElement;
      topOfElement?.scrollIntoView();
    }
  }
  getControl(field: string): AbstractControl {
    return this.form.get(field) as AbstractControl;
  }

  onFieldBlur(event: Event): void {
    console.log(event);
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
