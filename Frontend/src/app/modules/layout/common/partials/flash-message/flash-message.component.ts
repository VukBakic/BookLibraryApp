import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.scss'],
})
export class FlashMessageComponent implements OnInit {
  @Input() message: string | null = 'Success';
  @Input() status: string = 'alert-success';

  @Output() messageChange = new EventEmitter<string | null>();




  constructor() {}

  ngOnInit(): void {}

  toggleDismiss() {
    this.messageChange.emit(null);
  }
}
