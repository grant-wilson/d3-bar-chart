import { Component } from "@angular/core";
import { BarChartComponent } from "./bar-chart/bar-chart.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [BarChartComponent],
  template: `<app-bar-chart [data]="data"></app-bar-chart>`,
  styles: [],
})
export class AppComponent {
  data = [
    { category: "A", value: 1 },
    { category: "B", value: 2 },
    { category: "C", value: 3 },
    { category: "D", value: 2 },
    { category: "E", value: 1 },
  ];
}
