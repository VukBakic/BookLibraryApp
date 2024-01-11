import { Component, OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-borrowed',
  templateUrl: './borrowed.component.html',
  styleUrls: ['./borrowed.component.scss'],
})
export class BorrowedComponent implements OnInit {
  constructor(private userService: UserService) {}

  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;
  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;

  faClock = faClock;
  faAngleRight = faAngleRight;
  borrowed: Array<any> = [];

  loading = true;
  flashMessage: string | null = null;
  flashMessageStatus: string = 'alert-success';

  returnBook(id: any) {
    this.loading = true;
    this.userService.returnBook({ borrow: id }).subscribe({
      next: (val: any) => {
        this.updateBorrows();
        this.flashMessageStatus = 'alert-success';
        this.flashMessage = val.message;
        this.loading = false;
      },
      error: (err: any) => {
        this.flashMessageStatus = 'alert-danger';
        this.flashMessage = err.error.message;
        this.loading = false;
      },
    });
  }

  extendBook(id: any) {
    this.loading = true;
    this.userService.extendBook({ borrow: id }).subscribe({
      next: (val: any) => {
        console.log(val);
        this.flashMessageStatus = 'alert-success';
        this.flashMessage = val.message;
        this.loading = false;
        this.updateBorrows();
      },
      error: (err: any) => {
        this.flashMessageStatus = 'alert-danger';
        this.flashMessage = err.error.message;
        this.loading = false;
      },
    });
  }
  ngOnInit(): void {
    this.updateBorrows();
  }

  private updateBorrows(): void {
    this.userService.borrowedBooks().subscribe({
      next: (val: any) => {
        console.log(val);
        this.borrowed = val;
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
}
