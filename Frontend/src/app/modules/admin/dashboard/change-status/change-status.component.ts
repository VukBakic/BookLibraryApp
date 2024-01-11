import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/service/admin.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  id: string | null = null;
  user: any;
  requestLoading = false;
  msg: string | null = null;

  USER_IMAGES_URL = environment.USER_IMAGES_URL;
  DEFAULT_USER_IMAGE = environment.DEFAULT_USER_IMAGE;

  ngOnInit(): void {
    this.msg = history.state.message;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.adminService.getUser(this.id).subscribe({
        next: (val: any) => {
          this.user = val;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  acceptRequest() {
    this.msg = null;
    this.requestLoading = true;
    this.adminService.acceptUser(this.id).subscribe({
      next: (val: any) => {
        this.user = val.user;
        this.msg = 'Korisnik uspesno odobren.';
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.requestLoading = false;
      },
    });
  }
  denyRequest() {
    this.msg = null;
    this.requestLoading = true;
    this.adminService.deleteUser(this.id).subscribe({
      next: (val: any) => {
        this.user = val.user;
        this.router.navigate(['/admin/dashboard'], {
          state: { message: 'Korisnik je uspesno obrisan.' },
        });
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.requestLoading = false;
      },
    });
  }
  editUser() {
    this.router.navigate(['/admin/dashboard/edit-user/', this.id]);
  }
  activateUser() {
    this.msg = null;
    this.requestLoading = true;
    this.adminService.activate(this.id).subscribe({
      next: (val: any) => {
        this.user = val.user;
        this.msg = 'Korisnik uspesno deblokiran.';
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.requestLoading = false;
      },
    });
  }
  deactivateUser() {
    this.msg = null;
    this.requestLoading = true;
    this.adminService.deactivate(this.id).subscribe({
      next: (val: any) => {
        this.user = val.user;
        this.msg = 'Korisnik uspesno blokiran.';
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {
        this.requestLoading = false;
      },
    });
  }
}
