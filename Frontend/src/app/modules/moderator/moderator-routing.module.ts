import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddBookComponent } from './add-book/add-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { RequestEditComponent } from './request-edit/request-edit.component';
import { RequestListComponent } from './request-list/request-list.component';

const routes: Routes = [
  {
    path: 'edit-book/:id',
    component: EditBookComponent,
  },
  {
    path: 'add-book',
    component: AddBookComponent,
  },
  {
    path: 'requests',
    component: RequestListComponent,
  },
  {
    path: 'edit-request/:id',
    component: RequestEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModeratorRoutingModule {}
