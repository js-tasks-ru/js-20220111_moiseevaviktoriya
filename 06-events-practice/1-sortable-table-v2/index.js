export default class SortableTable {
  element;
  subElements;
  activeField;
  arrow = `<span class="sort-arrow"></span>`;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();

    if (this.sorted.id && this.sorted.order) {
      this.getInitialSorting(this.sorted.id, this.sorted.order);
    }

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
        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
            <span>${item.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow"></span>
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
    this.subElements.header.addEventListener('click', this.handleClick);
  }

  handleClick = event => {
    const active = event.target.closest('.sortable-table__cell');

    if (event.target.tagName !== 'SPAN' || active.dataset.sortable !== 'true') {
      return;
    }

    this.getActiveSortElement(active, active.dataset.order);

    this.sort(active.dataset.id, active.dataset.order);
  };

  getInitialSorting (fieldValue, orderValue) {
    this.activeField = this.subElements.header.querySelector("[data-id=" + fieldValue + "]");
    this.activeField.dataset.order = orderValue;
    this.activeField.children[1].innerHTML = this.arrow;
    this.sort(fieldValue, orderValue);
  }

  getActiveSortElement(active, orderValue = 'desc') {
    if (this.activeField !== active) {
      this.activeField.children[1].innerHTML = '';
      this.activeField = active;
      this.activeField.dataset.order = orderValue;
      this.activeField.children[1].innerHTML = this.arrow;
    } else {
      this.activeField.dataset.order = orderValue !== 'desc' ? 'desc' : 'asc';
    }
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
        this.sortByStingValue(fieldValue, direction);
        break;

      case 'number':
        this.sortByNumValue(fieldValue, direction);
        break;

      case 'date':
        break;
    }
  }

  sortByStingValue(fieldValue, direction) {
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
    this.subElements.body.innerHTML = this.getBodyItems();
  }

  destroy() {
    this.element.remove();
    this.subElements.header.removeEventListener('click', this.handleClick);
  }
}
