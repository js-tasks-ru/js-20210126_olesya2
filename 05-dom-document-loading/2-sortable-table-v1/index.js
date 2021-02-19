export default class SortableTable {
  element;
  subElements = {};

  constructor(header = [], {data = []} = {}) {
    this.header = header;
    this.data = data;

    this.render();
  }

  getHeaderTemplate(data) {
    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${data.map((item) => {
                return `<div class="sortable-table__cell" data-id=${item.id} data-sortable=${item.sortable} data-order="">
                            <span>${item.title}</span>
                            ${this.getSortingArrowTemplate()}
                        </div>`
            }).join('')}
        </div>
      `;
  }

  getTableBodyTemplate(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${data.map((item) => {
          return `
            <a href="/products/${item.id}" class="sortable-table__row">
              <div class="sortable-table__cell">
                ${item.images?.[0].url
                  ? `<img class="sortable-table-image" alt="${item.title}" src="${item.images?.[0].url}">`
                 : ''}
              </div>
              <div class="sortable-table__cell">${item.title}</div>

              <div class="sortable-table__cell">${item.quantity}</div>
              <div class="sortable-table__cell">${item.price}</div>
              <div class="sortable-table__cell">${item.sales}</div>
            </a>
          `
        }).join('')}
      </div>
    `;
  }

  getSortingArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>`;
  }

  getTable() {
    return `
        <div class="sortable-table">
            ${this.getHeaderTemplate(this.header)}
            ${this.getTableBodyTemplate(this.data)}
        </div>
    `
  }

  render() {
    const elementHeader = document.createElement('div');
    elementHeader.innerHTML = this.getTable();
    this.element = elementHeader.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  sort(field, direction) {
    const columns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
    const targetColumn = this.element.querySelector(`.sortable-table__cell[data-id=${field}]`);

    columns.forEach((item) => {
      item.dataset.order = '';
    })
    targetColumn.dataset.order = direction;

    this.subElements.body.innerHTML = this.getTableBodyTemplate(this.sortData(field, direction));
  }

  sortData(field, direction) {
    const sortedArr = [...this.data];
    const targetColumn = this.header.find((item) => item.id === field);
    const {sortType} = targetColumn;
    const sortingDirection = direction === 'asc' ? 1 : -1;

    return sortedArr.sort((a, b) => {
      switch(sortType) {
        case 'string':
          return sortingDirection * a[field].localeCompare(b[field], 'ru-en', { caseFirst: 'upper' });
        case 'number':
          return sortingDirection * (a[field] - b[field]);
        default:
          return sortedArr;
      }
    })
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {})
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

}
