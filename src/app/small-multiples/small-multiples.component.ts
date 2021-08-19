import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { parse } from 'csv/lib/es5/sync';
import { asyncScheduler, from, Observable, of, scheduled } from 'rxjs';
import { count, groupBy, map, mergeMap, startWith, toArray } from 'rxjs/operators';
import { LoadingComponent } from '../loading/loading.component';
import { UploadDatasetComponent } from './upload-dataset/upload-dataset.component';

const days = [
  "segunda",
  "segunda-feira",
  "terça",
  "terça-feira",
  "quarta",
  "quarta-feira",
  "quinta",
  "quinta-feira",
  "sexta",
  "sexta-feira",
  "sábado",
  "domingo",
  "amanhecer",
  "pleno dia",
  "anoitecer",
  "plena noite"
]

@Component({
  selector: 'app-small-multiples',
  templateUrl: './small-multiples.component.html',
  styleUrls: ['./small-multiples.component.scss']
})
export class SmallMultiplesComponent {

  public datasets = new Array(2022 - 2007)
    .fill(0)
    .map((v, i) => i + 2007)
    .map(year => ({
      name: `Acidentes Datatran ${year}`,
      delimiter: ';',
      data: fetch(`assets/datatran${year}.csv`).then(res => res.text())
    }));

  dataset = new FormControl(null, Validators.required);
  csv = new FormControl(null, Validators.required);
  column = new FormControl('causa_acidente', Validators.required);
  agregatingColumn = new FormControl('dia_semana', Validators.required);
  form = new FormGroup({
    dataset: this.dataset,
    csv: this.csv,
    column: this.column,
    agregatingColumn: this.agregatingColumn
  }, c => {
    const { dataset, csv, column, agregatingColumn } = c.value;
    const columns = Array.isArray(csv) && csv.length > 0 ? Object.keys(csv[0]) : [];
    if (columns.indexOf(column) == -1) {
      return { invalidColumn: true }
    }
    if (column == agregatingColumn) {
      return { invalidAgregatingColumn: true }
    }
    return null;
  });

  public columns$ = this.csv.valueChanges.pipe(
    map(csv => Array.isArray(csv) && csv.length > 0 ? Object.keys(csv[0]) : [])
  );

  public info$: Observable<Array<{ title: string, labels: string[], values: number[] }> | null> | undefined
    = this.form.valueChanges.pipe(mergeMap(({ dataset, csv, column, agregatingColumn }) => !this.form.valid ? of(null) :
      from(csv).pipe(
        groupBy((row: any) => `${row[column]}`.trim()),
        mergeMap(group =>
          group.pipe(
            groupBy(item => `${item[agregatingColumn]}`.trim()),
            mergeMap(agregation => agregation.pipe(
              count(),
              map(value => ({ label: agregation.key, value }))
            )),
            toArray(),
            map(vals => vals.sort((a, b) => {
              const dayOfWeekA = days.indexOf(`${a.label}`.trim().toLowerCase());
              const dayOfWeekB = days.indexOf(`${b.label}`.trim().toLowerCase());
              if (dayOfWeekA != -1) {
                return dayOfWeekA - dayOfWeekB;
              } else if (a.label == b.label) {
                return 0;
              } else if (a.label < b.label) {
                return -1;
              } else {
                return 1;
              }
            })),
            map(vals => {
              return vals.reduce((acc, { label, value }) => {
                acc.labels.push(label);
                acc.values.push(value);
                return acc;
              }, { labels: [] as string[], values: [] as number[] });
            }),
            map(({ labels, values }) => ({ title: group.key, labels, values }))
          )
        ),
        toArray()
      )
    ));

  constructor(private matDialog: MatDialog) {
    this.dataset.valueChanges
      .pipe(startWith(this.dataset.value))
      .subscribe(async dataset => {
        if (!dataset) return;
        const ref = matDialog.open(LoadingComponent, { disableClose: true });
        try {
          this.csv.setValue(null);
          // This line exists so the dialog can open before awaiting for data loading
          await scheduled([null], asyncScheduler).toPromise();
          const txt: string = await dataset.data;
          let csv: Array<{ [key: string]: string }> = parse(txt, { delimiter: dataset.delimiter, columns: true });
          this.csv.setValue(csv);
        } finally {
          ref.close();
        }
      });
  }

  async upload(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    let dataset = await this.matDialog.open(UploadDatasetComponent).afterClosed().toPromise();
    if (dataset) {
      this.datasets.push(dataset);
    }
  }

}
