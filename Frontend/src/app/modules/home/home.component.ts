import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/service/user.service';
import { environment } from 'environments/environment';

import SwiperCore, {
  SwiperOptions,
  EffectFade,
  Pagination,
  Mousewheel,
} from 'swiper';
SwiperCore.use([EffectFade, Pagination, Mousewheel]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  flashMessage: string | null = null;
  flashStatus: string = 'alert-success';

  top: any = [];

  DEFAULT_BOOK_IMAGE = environment.DEFAULT_BOOK_IMAGE;
  BOOK_IMAGE_URL = environment.BOOK_IMAGE_URL;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  sliderConfig: SwiperOptions = {
    spaceBetween: 30,
    effect: 'fade',
    loop: false,
    mousewheel: {
      invert: false,
    },
    // autoHeight: true,
    pagination: {
      el: '.blog-slider__pagination',
      clickable: true,
    },
  };
  ngOnInit(): void {
    const message = history.state.message;
    this.flashMessage = message;
    this.flashStatus = history.state.status
      ? history.state.status
      : this.flashStatus;

    this.userService.getTop3().subscribe({
      next: (val: any) => {
        this.top = [...val];
      },
    });
  }
}
