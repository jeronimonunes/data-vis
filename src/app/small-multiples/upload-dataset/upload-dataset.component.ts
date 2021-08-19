import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-dataset',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss']
})
export class UploadDatasetComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    file: new FormControl(null, Validators.required),
    delimiter: new FormControl(";", Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  fileChange(ev: Event) {
    const { target } = ev;
    if (target instanceof HTMLInputElement && target.files?.length) {
      const file = target.files.item(0)!;
      this.form.patchValue({ name: file.name, file: file.name });

    }

  }


}
