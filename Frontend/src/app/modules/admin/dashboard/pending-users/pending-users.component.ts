import {
  Component,
  OnInit,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { AdminService } from 'app/service/admin.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pending-users',
  templateUrl: './pending-users.component.html',
})
export class PendingUsersComponent implements OnInit, AfterViewInit {
  faEllipsisVertical = faEllipsisVertical;
  USER_IMAGES_URL = environment.USER_IMAGES_URL;
  DEFAULT_USER_IMAGE = environment.DEFAULT_USER_IMAGE;
  index = 1;
  cnt = 10;
  filter: 'pending' | 'all' = 'pending';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.reload.next(true);
  }

  flashMessage: string | null = null;

  ngOnInit(): void {
    const message = history.state.message;
    this.flashMessage = message;
  }

  setFilter(f: 'pending' | 'all') {
    this.filter = f;
    this.cdr.detectChanges();
    this.reload.next(true);
  }
  updateUsers() {
    this.getPending(this.index).subscribe({
      next: (val: any) => {
        this.users = val.data;
        this.cnt = val.count;
      },
      error: (e: any) => {
        console.log(e);
      },
    });
  }

  get getPending() {
    return this.filter == 'pending'
      ? this.adminService.getPendingUsers
      : this.adminService.getUsers;
  }

  users: any = [];
  reload: Subject<any> = new Subject();
  isLoading: boolean = false;
}
