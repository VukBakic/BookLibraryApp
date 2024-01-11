import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  faBars = faBars;

  ngOnInit(): void {}

  handleToggle() {
    document
      .getElementsByClassName('page-wrapper')[0]
      .classList.toggle('toggled');
  }
}
