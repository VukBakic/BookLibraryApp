import { Component, OnInit } from '@angular/core';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faCreditCard,
  faClipboard,
  faIdCard,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  faUser = faUser;
  faCreditCard = faCreditCard;
  faClipboard = faClipboard;
  faIdCard = faIdCard;
  constructor() {}

  ngOnInit(): void {}
}
