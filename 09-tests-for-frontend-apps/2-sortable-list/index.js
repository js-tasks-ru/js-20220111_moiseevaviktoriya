export default class SortableList {
  element;

  constructor({items = []} = {}) {
    this.items = items;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.getList();
    this.initEventListeners();
  }

  getTemplate() {
    return `
       <ul class="sortable-list"></ul>
    `;
  }

  getList() {
    if (this.items.length) {
      this.items.forEach(item => {
        this.element.append(item);
        item.classList.add('sortable-list__item');
      });
    }
  }

  initEventListeners() {
    this.element.addEventListener('dragstart', this.startDragging);
  }

  startDragging = event => {
    const active = event.target.closest('.sortable-list__item');

    if (!active) {
      return;
    }

  }
}
