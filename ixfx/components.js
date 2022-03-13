import {
  getSorter
} from "./chunk-4DMQ5B5V.js";
import "./chunk-VXBNK4QD.js";
import "./chunk-LFDYO2WO.js";
import "./chunk-EBSVTCOQ.js";
import "./chunk-QLMTBJ7O.js";
import {
  __decorateClass,
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField
} from "./chunk-FQLUQVDZ.js";

// src/components/HistogramVis.ts
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { repeat } from "lit/directives/repeat.js";
var jsonData = (obj) => {
  if (obj === null || obj === void 0 || obj === `undefined`)
    return;
  try {
    if (typeof obj === `string`) {
      if (obj.length === 0)
        return;
      const o = JSON.parse(obj);
      if (!Array.isArray(o)) {
        console.error(`Histogram innerText should be JSON array`);
        return;
      }
      for (let i = 0; i < o.length; i++) {
        if (!Array.isArray(o[i])) {
          console.error(`Histogram array should consist of inner arrays`);
          return;
        }
        if (o[i].length !== 2) {
          console.error(`Histogram inner arrays should consist of two elements`);
          return;
        }
        if (typeof o[i][0] !== `string`) {
          console.error(`First element of inner array should be a string (index ${i})`);
          return;
        }
        if (typeof o[i][1] !== `number`) {
          console.error(`Second element of inner array should be a number (index ${i})`);
          return;
        }
      }
      return o;
    }
  } catch (ex) {
    console.log(obj);
    console.error(ex);
  }
  return void 0;
};
var HistogramVis = class extends LitElement {
  constructor() {
    super();
    this.data = [];
    this.showDataLabels = true;
    this.height = `100%`;
    this.showXAxis = true;
    this.json = void 0;
  }
  connectedCallback() {
    if (!this.hasAttribute(`json`)) {
      this.setAttribute(`json`, this.innerText);
    }
    super.connectedCallback();
  }
  barTemplate(bar, index, _totalBars) {
    const { percentage } = bar;
    const [key, freq] = bar.data;
    const rowStart = 1;
    const rowEnd = 2;
    const colStart = index + 1;
    const colEnd = colStart + 1;
    const dataLabel = html`<div class="data">${freq}</div>`;
    const xAxis = html`${key}`;
    return html`
    <div class="bar" style="grid-area: ${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}">
      <div class="barTrack" style="height: ${(percentage ?? 0) * 100}%"></div>
      ${this.showDataLabels ? dataLabel : ``}
    </div>
    <div class="xAxisLabels" style="grid-area: ${rowStart + 2} / ${colStart} / ${rowEnd + 2} / ${colEnd}">
      ${this.showXAxis ? xAxis : ``}
    </div>`;
  }
  render() {
    if ((this.data === void 0 || this.data.length === 0) && this.json === void 0)
      return html``;
    const d = this.data ?? this.json;
    const length = d.length;
    const highestCount = Math.max(...d.map((d2) => d2[1]));
    const bars = d.map((kv) => ({ data: kv, percentage: kv[1] / highestCount }));
    const xAxis = html`<div class="xAxis" style="grid-area: 2 / 1 / 3 / ${d.length + 1}"></div>`;
    const height = this.height ? `height: ${this.height};` : ``;
    const h = html`
    <style>
    div.chart {
      grid-template-columns: repeat(${d.length}, minmax(2px, 1fr));
    }
    </style>
    <div class="container" style="${height}">
      <div class="chart">
      ${repeat(bars, (bar) => bar.data[0], (b, index) => this.barTemplate(b, index, length))}
        ${this.showXAxis ? xAxis : ``}
      </div>
    </div>`;
    return h;
  }
};
__publicField(HistogramVis, "styles", css`
    :host {
    }
    div.container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    div.chart {
      display: grid;
      flex: 1;
      grid-template-rows: 1fr 1px min-content;
      justify-items: center;
    }
    div.bar {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      justify-self: normal;
      padding-left: 0.3vw;
      padding-right: 0.3vw;
    }
    div.bar>div.barTrack {
      background-color: var(--histogram-bar-color, gray);
      align-self: stretch;
    }
    div.xAxisLabels, div.data {
      font-size: min(1vw, 1em);
      color: var(--histogram-label-color, currentColor);
    }
    div.xAxisLabels {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
    }
    div.xAxis {
      background-color: var(--histogram-axis-color, silver);
      width: 100%;
      height: 100%;
    }
  `);
__decorateClass([
  property()
], HistogramVis.prototype, "data", 2);
__decorateClass([
  property()
], HistogramVis.prototype, "showDataLabels", 2);
__decorateClass([
  property()
], HistogramVis.prototype, "height", 2);
__decorateClass([
  property()
], HistogramVis.prototype, "showXAxis", 2);
__decorateClass([
  property({ converter: jsonData, type: Object })
], HistogramVis.prototype, "json", 2);
HistogramVis = __decorateClass([
  customElement(`histogram-vis`)
], HistogramVis);

// src/components/FrequencyHistogramPlot.ts
var _sorter;
var FrequencyHistogramPlot = class {
  constructor(el) {
    __publicField(this, "el");
    __privateAdd(this, _sorter, void 0);
    this.el = el;
  }
  setAutoSort(sortStyle) {
    __privateSet(this, _sorter, getSorter(sortStyle));
  }
  clear() {
    if (this.el === void 0)
      return;
    this.el.data = [];
  }
  dispose() {
    const el = this.el;
    if (el === void 0)
      return;
    el.remove();
  }
  update(data) {
    if (this.el === void 0) {
      console.warn(`FrequencyHistogramPlot this.el undefined`);
      return;
    }
    if (__privateGet(this, _sorter) !== void 0) {
      this.el.data = __privateGet(this, _sorter).call(this, data);
    } else {
      this.el.data = [...data];
    }
  }
};
_sorter = new WeakMap();
export {
  FrequencyHistogramPlot,
  HistogramVis
};
//# sourceMappingURL=components.js.map