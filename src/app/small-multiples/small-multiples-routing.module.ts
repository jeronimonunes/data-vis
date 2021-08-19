import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmallMultiplesComponent } from './small-multiples.component';

const routes: Routes = [
  { path: "", component: SmallMultiplesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmallMultiplesRoutingModule { }
