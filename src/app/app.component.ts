import { Component } from '@angular/core';
import { parse } from 'csv/lib/es5/sync';
import { from, Observable } from 'rxjs';
import { count, groupBy, map, mergeMap, skip, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public info$: Observable<Array<{ data: { x: string, y: number }[], title: string }>> | undefined;

  async ngOnInit() {
    const res = await fetch('/assets/datatran2020.csv');
    const txt = await res.text();

    let result: Array<{ [key: string]: string }> = parse(txt, { delimiter: ";", columns: true });

    this.info$ = from(result).pipe(
      groupBy(item => item.causa_acidente),
      mergeMap(byAccident =>
        byAccident.pipe(
          groupBy(item => item.horario.substring(0, 2)),
          mergeMap(byHour => byHour.pipe(
            count(),
            map(qtd => ({ qtd, horario: byHour.key }))
          )),
          toArray(),
          map(vals => vals.sort((a, b) => a.horario == b.horario ? 0 : a.horario > b.horario ? 1 : -1)),
          map(vals => vals.map(({ horario, qtd }) => ({ x: horario, y: qtd }))),
          map(data => ({ title: byAccident.key, data }))
        )
      ),
      toArray()
    );
  }

}
