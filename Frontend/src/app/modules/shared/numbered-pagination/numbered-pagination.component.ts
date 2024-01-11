import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NumberedPagination } from './interfaces';
import { RulerFactoryOption } from './enums';
import { HttpClient } from '@angular/common/http';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'numbered-pagination',
  templateUrl: './numbered-pagination.component.html',
  styleUrls: ['./numbered-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberedPaginationComponent {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  totalPages: number = 0;

  @Input() index: number = 1;

  @Input() totalCount: number = 0;

  @Input() pageSize: number = 10;
  @Input() rulerLength: number = 5;

  @Output() loading = new EventEmitter<boolean>();
  @Output() page = new EventEmitter<any[]>();

  @Input() reload: Subject<any> = new Subject<any>();

  @Input() getFunction: ((arg: any) => Observable<Object>) | null = null;

  constructor() {}

  ngOnInit() {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.watchReload();
  }

  watchReload() {
    if (this.reload) {
      this.reload.asObservable().subscribe((reload: any) => {
        if (reload) {
          this.index = 1;
          this.getData(this.index);
        }
      });
    }
  }

  getData(index: number) {
    this.loading.emit(true);
    this.page.emit([]);
    this.index = index;

    if (this.getFunction)
      this.getFunction(this.index).subscribe({
        next: (response: any) => {
          this.totalCount = response.count;
          this.page.emit(response.data);
          this.totalPages = Math.ceil(response.count / this.pageSize);
          this.loading.emit(false);
        },
        error: (error: any) => {
          this.loading.emit(false);
          console.log(error.message);
        },
      });
  }

  get pagination(): NumberedPagination {
    let { index, totalPages, rulerLength } = this;
    if (totalPages < rulerLength) rulerLength = totalPages;

    const pages = ruler(index, totalPages, rulerLength);
    return { index, totalPages, pages } as NumberedPagination;
  }

  navigateToPage(pageNumber: number): void {
    if (allowNavigation(pageNumber, this.index, this.totalPages)) {
      this.getData(pageNumber);
      this.index = pageNumber;
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}

const ruler = (
  currentIndex: number,
  totalPages: number,
  rulerLength: number
): number[] => {
  const array = new Array(rulerLength).fill(null);
  const min = Math.floor(rulerLength / 2);

  return array.map((_, index) =>
    rulerFactory(currentIndex, index, min, totalPages, rulerLength)
  );
};

const rulerOption = (
  currentIndex: number,
  min: number,
  totalPages: number
): RulerFactoryOption => {
  return currentIndex <= min
    ? RulerFactoryOption.Start
    : currentIndex >= totalPages - min
    ? RulerFactoryOption.End
    : RulerFactoryOption.Default;
};

const rulerFactory = (
  currentIndex: number,
  index: number,
  min: number,
  totalPages: number,
  rulerLength: number
): number => {
  const factory = {
    [RulerFactoryOption.Start]: () => index + 1,
    [RulerFactoryOption.End]: () => totalPages - rulerLength + index + 1,
    [RulerFactoryOption.Default]: () => currentIndex + index - min,
  };

  return factory[rulerOption(currentIndex, min, totalPages)]();
};

const allowNavigation = (
  pageNumber: number,
  index: number,
  totalPages: number
): boolean => {
  return pageNumber !== index && pageNumber > 0 && pageNumber <= totalPages;
};
