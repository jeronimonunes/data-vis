import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { parse } from 'csv/lib/es5/sync';
import { from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { readFile } from 'src/app/utils';

@Component({
  selector: 'app-upload-dataset',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss']
})
export class UploadDatasetComponent {

  form: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
    fileReference: new FormControl(null, Validators.required),
    delimiter: new FormControl(";", Validators.required),
    data: new FormControl(null)
  }, undefined, c => {
    const { fileReference, delimiter, data } = c.value;
    if (data == null) {
      const data = readFile(fileReference);
      return from(data).pipe(
        map(txt => parse(txt, { delimiter, columns: true })),
        mergeMap(csv => Array.isArray(csv) && csv.length > 1 ? of(null) : throwError('Empty CSV')),
        tap(() => this.form.patchValue({ data })),
        catchError(err => of({ csv: true }))
      );
    }
    return of(null);
  });

  async fileChange(ev: Event) {
    const { target } = ev;
    if (target instanceof HTMLInputElement && target.files?.length) {
      const file = target.files.item(0)!;
      this.form.setValue({ name: file.name, file: file.name, fileReference: file, data: null, delimiter: this.form.value.delimiter });
    }
  }


}
