export default class SortableTable {
  element;
  subElements = {};

  onSortClick = (evt) => {
    const column = evt.target.closest('[data-sortable="true"]');

    const toggleDirection = (direction) => {
      const directions = {
        asc : 'desc',
        desc: 'asc',
      }
      return directions[direction];
    };

    if (column) {
      const {id, order} = column.dataset;
      const sortedData = this.sortData(id, toggleDirection(order));
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = toggleDirection(order);

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableBodyTemplate(sortedData);
    }
  }

  constructor(header = [], {
    data = [],
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc',
    }
  } = {}) {
    this.header = header;
    this.data = data;
    this.sorted = sorted;

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  getHeaderTemplate(data) {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
          ${data.map((item) => {

            const direction = this.sorted.id === item.id ? this.sorted.order : 'asc';

            return `<div class="sortable-table__cell" data-id=${item.id} data-sortable=${item.sortable} data-order=${direction}>
                      <span>${item.title}</span>
                      ${this.getSortingArrowTemplate(item.id)}
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
                  ${item.images?.[0].url ? `<img class="sortable-table-image" alt="${item.title}" src="${item.images?.[0].url}">` : ''}
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

  getSortingArrowTemplate(id) {
    const isOrderExists = this.sorted.id === id ? this.sorted.order : '';
    return isOrderExists ?
      `<span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`
      : ``;
  }

  getTable(data) {
    return `
        <div class="sortable-table">
            ${this.getHeaderTemplate(this.header)}
            ${this.getTableBodyTemplate(data)}
        </div>
    `
  }

  render() {
    const {id, order} = this.sorted;
    const elementWrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);

    elementWrapper.innerHTML = this.getTable(sortedData);

    this.element = elementWrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  sortData(field, direction) {
    const sortedArr = [...this.data];
    const targetColumn = this.header.find((item) => item.id === field);
    const {sortType} = targetColumn;
    const sortingDirection = direction === 'asc' ? 1 : -1;

    return sortedArr.sort((a, b) => {
      switch (sortType) {
        case 'string':
          return sortingDirection * a[field].localeCompare(b[field], 'ru-en', {caseFirst: 'upper'});
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
