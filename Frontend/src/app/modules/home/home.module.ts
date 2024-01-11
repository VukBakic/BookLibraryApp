import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, SwiperModule, SearchModule],
})
export class HomeModule {}
