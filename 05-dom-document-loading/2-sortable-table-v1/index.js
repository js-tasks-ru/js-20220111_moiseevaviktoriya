export default class SortableTable {
  element;
  subElements;
  sortField;
  orderValue;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
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
    </div>
    `;
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
      const HeaderItems = this.headerConfig.map(item => {
        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
            <span>${item.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow"></span>
          </div>
        `;
      });

      return HeaderItems.join('');
    }
  }


  getBodyItems() {
    if (this.data.length) {
      const BodyItems = this.data.map(product => {
        return `
          <a href="/products/${product.id}" class="sortable-table__row">
            ${this.getBodyItemData(product)}
          </a>
        `;
      });

      return BodyItems.join('');
    }
  }

  getBodyItemData(product) {
    if (this.headerConfig.length) {
      const BodyItemData = this.headerConfig.map(item => {
        if (item.id === 'images') {
          return item.template(product.images);
        } else {
          return `
            <div class="sortable-table__cell">${product[item.id]}</div>
          `;
        }

      });

      return BodyItemData.join('');
    }
  }

  sort(fieldValue, orderValue) {
    const arrow = `
        <span class="sort-arrow"></span>
      `;
    const activeField = this.subElements.header.querySelector("[data-id=" + fieldValue + "]");

  }

  update() {

  }


  destroy() {
    this.element.remove();
  }
}

