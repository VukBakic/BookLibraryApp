import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/service/auth.service';
import { UserService } from 'app/service/user.service';

import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;
  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  USER_IMAGES_URL = environment.USER_IMAGES_URL;
  DEFAULT_USER_IMAGE = environment.DEFAULT_USER_IMAGE;

  id: string | null = null;
  msg: string | null = null;
  book: any | null = null;

  index = 1;
  cnt = 10;
  filter: 'pending' | 'all' = 'pending';
  reviews: any = [];

  reviewRating = 0;
  charachtersCount = 0;

  reload: Subject<any> = new Subject();
  isLoading: boolean = false;

  ratingError: string | null = null;
  commentError: string | null = null;

  flashMessage: string | null = null;
  flashMessageStatus: string = 'alert-success';
  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
    comment: ['', Validators.required],
    book: ['', Validators.required],
  });

  isMod = false;
  canReview = false;
  edit = false;
  user_id: any = null;

  rating_id: any = null;

  book_rating: any = null;
  book_stars: any = 0;
  get getReviews() {
    return this.userService.getReviews;
  }

  ngAfterViewInit(): void {
    this.reload.next(true);
  }
  toggleEdit(rating: any, comment: any, rating_id: any): void {
    this.reviewForm.patchValue({ rating: rating, comment: comment });
    this.reviewRating = rating;
    this.canReview = true;
    this.edit = true;
    this.rating_id = rating_id;
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 200);
  }
  ngOnInit(): void {
    const user = this.authService.user;
    this.user_id = user?._id;
    if (user.role == 'moderator') this.isMod = true;

    this.reviewForm.get('comment')?.valueChanges.subscribe((val) => {
      this.charachtersCount = val.length;
    });
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.reviewForm.get('book')?.setValue(this.id);
      this.userService.getBook(this.id).subscribe({
        next: (val: any) => {
          this.book = val;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
      this.updateBookRating();

      this.userService.canReview(this.id).subscribe({
        next: (val: any) => {
          this.canReview = val.check;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  updateBookRating() {
    this.userService.getBookRating(this.id).subscribe({
      next: (val: any) => {
        this.book_rating = val.rating;
        this.book_stars = parseFloat(
          (Math.round(this.book_rating * 4) / 4).toFixed(2)
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  changeRating(rating: any) {
    this.ratingError = null;
    let r = parseInt(rating);
    this.reviewForm.get('rating')?.setValue(r);
    this.reviewRating = r;
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  onSubmit() {
    this.ratingError = null;
    this.commentError = null;
    if (this.reviewForm.valid) {
      if (this.edit) {
        this.userService
          .editReview({ ...this.reviewForm.value, id: this.rating_id })
          .subscribe({
            next: (val: any) => {
              this.flashMessageStatus = 'alert-success';
              this.flashMessage = 'Uspesno ste izmenili recenziju';
              this.scrollToTop();
              this.reload.next(true);
              this.canReview = false;
              this.updateBookRating();
            },
            error: (err: any) => {
              console.log(err);
              this.flashMessageStatus = 'alert-danger';
              this.flashMessage = 'Greska';
              this.scrollToTop();
            },
          });
      } else
        this.userService.addReview(this.reviewForm.value).subscribe({
          next: (val: any) => {
            this.flashMessageStatus = 'alert-success';
            this.flashMessage = 'Uspesno ste dodali recenziju';
            this.scrollToTop();
            this.reload.next(true);
            this.canReview = false;
          },
          error: (err: any) => {
            console.log(err);
            this.flashMessageStatus = 'alert-danger';
            this.flashMessage = 'Greska';
            this.scrollToTop();
          },
        });
    } else {
      if (this.reviewForm.get('rating')?.invalid) {
        this.ratingError = 'Unesite ocenu od 1 do 10.';
      }
      if (this.reviewForm.get('comment')?.invalid) {
        this.commentError = 'Unesite recenziju.';
      }
    }
  }
  handleBorrow() {
    this.userService.borrowBook(this.id).subscribe({
      next: (val: any) => {
        this.flashMessageStatus = 'alert-success';
        this.flashMessage = val.message;
        this.book.taken++;
        this.scrollToTop();
      },
      error: (err: any) => {
        console.log(err);
        this.flashMessageStatus = 'alert-danger';
        this.flashMessage = err.error.message;
        this.scrollToTop();
      },
    });
  }
}
