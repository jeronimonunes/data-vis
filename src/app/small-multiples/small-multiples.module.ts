import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LineChartDirective } from './line-chart.directive';
import { SmallMultiplesRoutingModule } from './small-multiples-routing.module';
import { SmallMultiplesComponent } from './small-multiples.component';
import { UploadDatasetComponent } from './upload-dataset/upload-dataset.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    SmallMultiplesComponent,
    LineChartDirective,
    UploadDatasetComponent
  ],
  imports: [
    CommonModule,
    SmallMultiplesRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ]
})
export class SmallMultiplesModule { }
