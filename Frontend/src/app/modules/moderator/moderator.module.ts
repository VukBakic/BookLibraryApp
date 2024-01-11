import { NgModule } from '@angular/core';
import { ModeratorRoutingModule } from './moderator-routing.module';
import { EditBookComponent } from './edit-book/edit-book.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NumberedPaginationModule } from '../shared/numbered-pagination/numbered-pagination.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddBookComponent } from './add-book/add-book.component';
import { RequestListComponent } from './request-list/request-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestEditComponent } from './request-edit/request-edit.component';

@NgModule({
  declarations: [EditBookComponent, AddBookComponent, RequestListComponent, RequestEditComponent],
  imports: [
    SharedModule,
    ModeratorRoutingModule,
    FontAwesomeModule,
    NumberedPaginationModule,
    NgSelectModule,
    NgbModule,
  ],
})
export class ModeratorModule {}
