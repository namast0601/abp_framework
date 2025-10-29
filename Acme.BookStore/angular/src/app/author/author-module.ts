import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorRoutingModule } from './author-routing-module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthorComponent } from './author';


@NgModule({
  declarations: [AuthorComponent],
  imports: [
    CommonModule,
    AuthorRoutingModule,
    AuthorRoutingModule,
    NgbDatepickerModule
  ]
})
export class AuthorModule { }
