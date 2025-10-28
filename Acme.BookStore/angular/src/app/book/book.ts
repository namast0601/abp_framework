import { CoreModule, ListService, LocalizationPipe, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BookService } from '../proxy/books';
import { BookDto, bookTypeOptions } from '../proxy';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalCloseDirective, ModalComponent } from '@abp/ng.theme.shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateNativeAdapter,
  NgbDateAdapter,
  NgbInputDatepicker,
  NgbDropdown,
  NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem
} from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
// add new imports
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-book',
  standalone: true,
  templateUrl: './book.html',
  styleUrls: ['./book.scss'],
  imports: [
    CommonModule,
    NgxDatatableModule,
    LocalizationPipe,
    DatePipe,
    CurrencyPipe,
    ModalComponent,
    NgbInputDatepicker,
    CoreModule,
    ModalCloseDirective,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem
  ],
  providers: [
    ListService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter } ]
})
export class BookComponent implements OnInit {
  book = { items: [], totalCount: 0 } as PagedResultDto<BookDto>;

  selectedBook = {} as BookDto; // declare selectedBook

  form: FormGroup;

  bookTypes = bookTypeOptions;

  isModalOpen = false;

//change the constructor
  constructor(
    public readonly list: ListService,
    private bookService: BookService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService // inject the ConfirmationService
  ) {}


  ngOnInit() {
    const bookStreamCreator = (query) => this.bookService.getList(query);

    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }

  createBook() {
    this.selectedBook = {} as BookDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
      publishDate: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  editBook(id: string) {
    this.bookService.get(id).subscribe((book) => {
      this.selectedBook = book;

      this.buildForm();

      let jsDate = null;
      if (book.publishDate) {
        const d = new Date(book.publishDate);
        if (!isNaN(d.getTime())) {
          jsDate = d; // ✅ dùng Date chứ không dùng {year, month, day}
        }
      }

      this.form.patchValue({
        name: book.name,
        type: book.type,
        publishDate: jsDate, // ✅ JS Date
        price: book.price,
      });

      this.isModalOpen = true;
    });
  }

  // change the save method
  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedBook.id
      ? this.bookService.update(this.selectedBook.id, this.form.value)
      : this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }
  // Add a delete method
delete(id: string) {
  this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
    if (status === Confirmation.Status.confirm) {
      this.bookService.delete(id).subscribe(() => this.list.get());
    }
  });
}
}
