import { Component, OnInit } from '@angular/core';
import { CoreModule, ListService, LocalizationPipe, PagedResultDto } from '@abp/ng.core';
import { AuthorService } from '../proxy/author';
import { AuthorDto } from '../proxy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ThemeSharedModule } from '@abp/ng.theme.shared';
import { DatePipe } from '@angular/common';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';

import {
  NgbDateAdapter, NgbDateNativeAdapter,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-author',
  imports: [
    LocalizationPipe,
    DatePipe,
    DataTableColumnDirective,
    NgbInputDatepicker,
    NgxDatatableModule,
    ThemeSharedModule,
    CoreModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownItem,
    NgbDropdownMenu
  ],
  templateUrl: './author.html',
  styleUrl: './author.scss',
  providers: [ListService,{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class AuthorComponent implements OnInit {
  author = { items: [], totalCount: 0 } as PagedResultDto<AuthorDto>;

  isModalOpen = false;

  form: FormGroup;

  selectedAuthor = {} as AuthorDto;

  constructor(
    public readonly list: ListService,
    private authorService: AuthorService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    const authorStreamCreator = (query) => this.authorService.getList(query);

    this.list.hookToQuery(authorStreamCreator).subscribe((response) => {
      this.author = response;
    });
  }

  createAuthor() {
    this.selectedAuthor = {} as AuthorDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editAuthor(id: string) {
    this.authorService.get(id).subscribe((author) => {
      this.selectedAuthor = author;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedAuthor.name || '', Validators.required],
      birthDate: [
        this.selectedAuthor.birthDate ? new Date(this.selectedAuthor.birthDate) : null,
        Validators.required,
      ],
      shortBio: [
        this.selectedAuthor.shortBio ? this.selectedAuthor.shortBio : null,
        Validators.required,
      ],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (this.selectedAuthor.id) {
      this.authorService
        .update(this.selectedAuthor.id, this.form.value)
        .subscribe(() => {
          this.isModalOpen = false;
          this.form.reset();
          this.list.get();
        });
    } else {
      this.authorService.create(this.form.value).subscribe(() => {
        this.isModalOpen = false;
        this.form.reset();
        this.list.get();
      });
    }
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure')
      .subscribe((status) => {
        if (status === Confirmation.Status.confirm) {
          this.authorService.delete(id).subscribe(() => this.list.get());
        }
      });
  }
}
