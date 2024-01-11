import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;

  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;

  index = 1;
  cnt = 10;
  filter: any = {};

  form = this.fb.group({
    name: [''],
    author: [''],
  });
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    this.reload.next(true);
  }
  onSubmit(): void {
    const message = history.state.message;
    this.flashMessage = message;
    this.flashStatus = history.state.status
      ? history.state.status
      : this.flashStatus;

    this.filter = this.form.value;
    this.cdr.detectChanges();
    this.reload.next(true);
  }
  toggleAdvancedSearch(): void {}
  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  ngOnInit(): void {
    const message = history.state.message;
    this.flashMessage = message;
    this.flashStatus = history.state.status
      ? history.state.status
      : this.flashStatus;
  }

  get updateFunc() {
    return (page: any) => {
      return this.userService.getReqBooks(page, this.filter);
    };
  }

  books: any = [];
  reload: Subject<any> = new Subject();
  isLoading: boolean = false;
}
