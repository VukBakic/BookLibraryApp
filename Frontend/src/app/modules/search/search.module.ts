import { NgModule } from '@angular/core';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { NumberedPaginationModule } from '../shared/numbered-pagination/numbered-pagination.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    SearchRoutingModule,
    FontAwesomeModule,
    NumberedPaginationModule,
    NgbModule,
    NgSelectModule,
  ],
})
export class SearchModule {}
