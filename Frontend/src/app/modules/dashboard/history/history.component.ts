import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCaretDown,
  faCaretUp,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'app/service/auth.service';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  faEllipsisVertical = faEllipsisVertical;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;

  index = 1;
  cnt = 10;
  filter: any = {
    sort: 3,
    asc: 0,
  };

  role: 'user' | 'admin' | 'moderator' | 'none' = 'none';

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

  handleSort(index: number) {
    if (this.filter.sort == index) {
      this.filter.asc = this.filter.asc == 0 ? 1 : 0;
    } else {
      this.filter.sort = index;
      this.filter.asc = 1;
    }
    this.reload.next(true);
  }
  checkCaret(index: number) {
    if (this.filter.sort != index) return false;
    else {
      return this.filter.asc ? false : true;
    }
  }

  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  ngOnInit(): void {
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
      return this.userService.getHistory(page, this.filter);
    };
  }

  borrowHistory: any = [];
  reload: Subject<any> = new Subject();
  isLoading: boolean = false;
}
