import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router, private matDialog: MatDialog) {
    let ref: MatDialogRef<LoadingComponent> | null = null;
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (ref)
          ref.close();
        ref = this.matDialog.open(LoadingComponent, { disableClose: true });
      }
      if (event instanceof NavigationEnd) {
        if (ref)
          ref.close();
      }

      // Set loading state to false in both of the below events to hide the spinner in case a request fails
      if (event instanceof NavigationCancel) {
        if (ref)
          ref.close();
      }
      if (event instanceof NavigationError) {
        if (ref)
          ref.close();
      }
    })
  }

}
