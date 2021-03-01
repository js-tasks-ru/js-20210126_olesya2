import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = new URL('https://course-js.javascript.ru/');

export default class ColumnChart {
  subElements = {};

  constructor(props = {}) {
    const {
      label = '',
      link = '',
      chartHeight = 50,
      url = '',
      range = {
        from: new Date(),
        to: new Date(),
      },
      formatHeading = data => data,
    } = props;

    this.loadingClass = 'column-chart_loading';

    this.label = label;
    this.link = link;
    this.chartHeight = chartHeight;

    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.formatHeading = formatHeading;


    this.render();
    this.getData(this.range.from, this.range.to);

  }

  async getData(from, to) {
    this.element.classList.add(this.loadingClass);

    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';

    const fromParam = from.toISOString();
    const toParam = to.toISOString();

    const response = await fetchJson(`${this.url}?from=${fromParam}&to=${toParam}`);

    if (Object.values(response).length) {
      this.subElements.header.textContent = this.getHeaderValue(response);

      this.subElements.body.innerHTML = this.getColumnTemplate(Object.values(response));
    }

    this.element.classList.remove(this.loadingClass);
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
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

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  get template() {
    return `
      <div class="column-chart ${this.loadingClass}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}

          ${this.link ? (
            `<a href="${this.link}" class="column-chart__link">View all</a>`
          ) : ``}

        </div>

        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(from, to) {
    return this.getData(from, to);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
