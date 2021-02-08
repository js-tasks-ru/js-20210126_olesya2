export default class ColumnChart {
  constructor(props = {}) {
    const {data = [], label = '', value = 0, link = '', chartHeight = 50} = props;

    this.emptyClass = 'column-chart_loading';

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.chartHeight = chartHeight;

    this.render();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getColumnTemplate() {
    return this.getColumnProps(this.data).map((item) => {
      return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`
    }).join('')
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="column-chart ${!this.data.length ? this.emptyClass : ''}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}

        ${this.link ? (
          `<a href="${this.link}" class="column-chart__link">View all</a>`
        ) : ``}

      </div>
      <div class="column-chart__container">

        <div data-element="header" class="column-chart__header">
           ${this.value}
        </div>

        <div data-element="body" class="column-chart__chart">
            ${this.data && this.data.length ? this.getColumnTemplate() : ''}
        </div>

      </div>
    </div>
    `;

    this.element = element.firstElementChild;
  }

  update() {

  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
