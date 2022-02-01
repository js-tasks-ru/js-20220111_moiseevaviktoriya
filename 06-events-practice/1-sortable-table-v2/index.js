export default class SortableTable {
  element;
  subElements = {};

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  render() {
    const element = document.createElement('div');

    this.sort(this.sorted.id, this.sorted.order);

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();

    this.initEventListeners();
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getHeaderItems()}
            </div>

            <div data-element="body" class="sortable-table__body">
                ${this.getBodyItems()}
            </div>
        </div>
    </div>`;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }

  getHeaderItems() {
    if (this.headerConfig.length) {
      const headerItems = this.headerConfig.map(item => {
        let order = this.sorted.id === item.id ? this.sorted.order : 'asc';
        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
            <span>${item.title}</span>
            ${this.getSortingArrow(item.id)}
          </div>
        `;
      });

      return headerItems.join('');
    }
  }

  getBodyItems() {
    if (this.data.length) {
      const bodyItems = this.data.map(product => {
        return `
          <a href="/products/${product.id}" class="sortable-table__row">
            ${this.getBodyItemData(product)}
          </a>
        `;
      });

      return bodyItems.join('');
    }
  }

  getBodyItemData(product) {
    if (this.headerConfig.length) {
      const bodyItemData = this.headerConfig.map(item => {
        if (item.template) {
          return item.template(product.images);
        } else {
          return `
            <div class="sortable-table__cell">${product[item.id]}</div>
          `;
        }
      });

      return bodyItemData.join('');
    }
  }

  initEventListeners () {
    this.subElements.header.addEventListener('pointerdown', this.handleClick);
  }

  handleClick = event => {
    const active = event.target.closest('[data-sortable="true"]');

    if (!active) {
      return;
    }

    const order = active.dataset.order === 'asc' ? 'desc' : 'asc';
    active.dataset.order = order;
    this.sort(active.dataset.id, order);

    const arrow = active.querySelector('.sortable-table__sort-arrow');

    if (!arrow) {
      active.append(this.subElements.arrow);
    }

    this.subElements.body.innerHTML = this.getBodyItems();
  };


  getSortingArrow(id) {
    return this.sorted.id === id ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>` : '';
  }

  sort(fieldValue, orderValue) {
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    const sortType = this.headerConfig.find(item => {
      return item.id === fieldValue;
    }).sortType;


    switch (sortType) {
      case 'string':
        this.sortByStringValue(fieldValue, direction);
        break;

      case 'number':
        this.sortByNumValue(fieldValue, direction);
        break;

      case 'date':
        break;
    }
  }

  sortByStringValue(fieldValue, direction) {
    const sortedData = [...this.data].sort((a, b) => {
      return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
    });

    this.update(sortedData);
  }

  sortByNumValue(fieldValue, direction) {
    const sortedData = [...this.data].sort((a, b) => {
      return direction * (a[fieldValue] - b[fieldValue]);
    });

    this.update(sortedData);
  }

  update(newData) {
    this.data = newData;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
