import {
  Component,
  computed,
  input,
  effect,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";

@Component({
  selector: "app-bar-chart",
  standalone: true,
  imports: [],
  template: `
    <svg [attr.width]="width" [attr.height]="height">
      <defs>
        <linearGradient
          id="angular-gradient"
          x1="0"
          x2="982"
          y1="192"
          y2="192"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F0060B"></stop>
          <stop offset="0" stop-color="#F0070C"></stop>
          <stop offset=".526" stop-color="#CC26D5"></stop>
          <stop offset="1" stop-color="#7702FF"></stop>
        </linearGradient>
      </defs>
      @for (bar of bars(); track $index) {
      <rect
        [attr.x]="bar.x"
        [attr.y]="bar.y"
        [attr.width]="bar.width"
        [attr.height]="bar.height"
        fill="url(#angular-gradient)"
      ></rect>
      }
      <g #xAxis attr.transform="translate(0,{{ height - margin }})"></g>
      <g #yAxis attr.transform="translate({{ margin }}, 0)"></g>
    </svg>
  `,
  styles: ``,
})
export class BarChartComponent {
  width = 500;
  height = 500;
  margin = 30;
  data = input<{ category: string; value: number }[]>([]);
  xScale = computed(() =>
    // 1. start with the scale function that best fits our use case.
    scaleBand()
      // 2. specify the values that the resulting scale function will accept as input.
      // Since we are working in a computed signal, we can depend on dynamic updates from the data property.
      .domain(this.data().map((d) => d.category))
      // 3. we specify the values the the resulting function will output.
      // To allow for some padding around the chart we start with a margin offset instead of 0, and finish with that same margin.
      .range([this.margin, this.width - this.margin])
      // 4. Finally, we add some padding to the scale to prevent the resulting bars from being too crowded.
      // Try removing this line to see what happens!
      .padding(0.1)
  );
  yScale = computed(() =>
    // 1. Scale linear suits our numeric y-axis
    scaleLinear()
      // 2. The domain is given by our data. We will start our y-axis at 0, and make the maximum value the same as the input data.
      .domain([0, max(this.data(), (d) => d.value) ?? 0])
      // 3. When creating the range we put the larger value first so that low values from the input domain are mapped to high values in the output.
      // This is because SVG coordinages start with (0,0) in the top left but we want our chart to start at the bottom left. By reversing the range
      // we map 0 to the bottom and increasing numbers closer to the top, with a maximum at the margin.
      .range([this.height - this.margin, this.margin])
  );
  bars = computed(() =>
    this.data().map((d) => ({
      x: this.xScale()(d.category),
      y: this.yScale()(d.value),
      width: this.xScale().bandwidth(),
      height: this.yScale()(0) - this.yScale()(d.value),
    }))
  );

  @ViewChild("xAxis", { static: true })
  xAxis!: ElementRef<SVGGElement>;

  @ViewChild("yAxis", { static: true })
  yAxis!: ElementRef<SVGGElement>;

  constructor() {
    effect(() => {
      select(this.xAxis.nativeElement).call(axisBottom(this.xScale()));
    });
    effect(() => {
      select(this.xAxis.nativeElement).call(axisBottom(this.xScale()));
      select(this.yAxis.nativeElement).call(axisLeft(this.yScale()));
    });
  }
}
