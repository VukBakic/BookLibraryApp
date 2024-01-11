import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'app/service/auth.service';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;

  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;

  index = 1;
  cnt = 10;
  filter: any = {};

  form = this.fb.group({
    name: [''],
    author: [''],
    to: [''],
    from: [''],
    publisher: [''],
    genre: [''],
  });

  role: 'user' | 'admin' | 'moderator' | 'none' = 'none';

  genres: any = [];
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.reload.next(true);
  }
  onSubmit(): void {
    this.filter = { ...this.form.value };

    for (let prop in this.filter) {
      if (!this.filter[prop]) {
        delete this.filter[prop];
      }
    }

    this.cdr.detectChanges();
    this.reload.next(true);
  }

  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  ngOnInit(): void {
    this.userService.getGenres().subscribe({
      next: (val: any) => {
        this.genres = [...val];
      },
    });

    let user = this.authService.user;

    if (user) {
      this.role = user.role;
    }

    const message = history.state.message;
    this.flashMessage = message;
    this.flashStatus = history.state.status
      ? history.state.status
      : this.flashStatus;
  }

  get updateFunc() {
    return (page: any) => {
      return this.userService.getBooks(page, this.filter);
    };
  }

  books: any = [];
  reload: Subject<any> = new Subject();
  isLoading: boolean = false;
}
