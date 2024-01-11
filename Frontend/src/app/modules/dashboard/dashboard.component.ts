import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  bookOfTheDay: any = null;

  notifications: any = [];

  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;
  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const { message, status } = history.state;
    this.flashMessage = message;
    this.flashStatus = status ? status : 'alert-success';

    this.userService.notifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (e) => {
        console.log(e);
      },
    });

    this.userService.getBookOfTheDay().subscribe({
      next: (data) => {
        this.bookOfTheDay = data.book;
        this.bookOfTheDay.rating = data.rating;
        this.bookOfTheDay.stars = parseFloat(
          (Math.round(data.rating * 4) / 4).toFixed(2)
        );
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
