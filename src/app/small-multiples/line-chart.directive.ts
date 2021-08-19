import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartData } from 'chart.js';

@Directive({
  selector: '[appLineChart]'
})
export class LineChartDirective implements OnChanges {

  @Input() appLineChart: undefined | {
    title: string;
    labels: string[];
    values: number[];
  }

  chart: Chart<'line', number[], string>;

  constructor(ref: ElementRef<HTMLCanvasElement>) {
    const data: ChartData<'line', number[], string> = {
      labels: this.appLineChart?.labels || [],
      datasets: [{
        label: '# Acidentes',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: this.appLineChart?.values || [],
      }]
    };

    this.chart = new Chart(ref.nativeElement, {
      type: 'line',
      data,
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appLineChart) {
      const { title, labels, values } = changes.appLineChart.currentValue;
      this.chart.options.plugins!.title = {
        display: true,
        text: title
      }
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
    }
    this.chart.update();
  }

}
