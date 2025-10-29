import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing-module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BookRoutingModule,
    // NgxDatatableModule,
    NgbDatepickerModule
  ]
})
export class BookModule { }
