export default class ColumnChart {
  subElements = {};

  constructor(props = {}) {
    const {data = [], label = '', value = 0, link = '', chartHeight = 50} = props;

    this.loadingClass = 'column-chart_loading';

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

  getColumnTemplate(data) {
    return this.getColumnProps(data).map((item) => {
      return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`
    }).join('')
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="column-chart ${!this.data.length ? this.loadingClass : ''}" style="--chart-height: ${this.chartHeight}">
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
            ${this.data && this.data.length ? this.getColumnTemplate(this.data) : ''}
        </div>

      </div>
    </div>
    `;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(data) {
    this.getColumnProps(data);
    this.subElements.body.innerHTML = this.getColumnTemplate(data);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
