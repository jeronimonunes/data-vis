import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent { }

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [LoadingComponent]
})
export class LoadingModule { }
