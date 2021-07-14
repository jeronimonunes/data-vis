import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartData } from 'chart.js';

@Directive({
  selector: '[appLineChart]'
})
export class LineChartDirective implements OnChanges {

  @Input() appLineChart: { x: string, y: number }[] | undefined;
  @Input() title: string | undefined;

  chart: Chart<'line', { x: string, y: number }[], string>;

  constructor(ref: ElementRef<HTMLCanvasElement>) {
    const labels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

    const data: ChartData<'line', { x: string, y: number }[], string> = {
      labels: labels,
      datasets: [{
        label: '# Acidentes',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: this.appLineChart || [],
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
      this.chart.data.datasets[0].data = changes.appLineChart.currentValue;
    }
    if (changes.title) {
      this.chart.options.plugins!.title = {
        display: true,
        text: changes.title.currentValue
      }
    }
    this.chart.update();
  }

}
