export default class SortableList {
  element;
  active;

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
        item.draggable = true;
      });
    }
  }

  initEventListeners() {
    this.element.addEventListener('dragstart', this.startDragging);
  }

  startDragging = event => {
    const activeGrabHandle = event.currentTarget.closest('[data-grab-handle]');
    console.log(event);

    if (!this.active) {
      return;
    }

    this.active = activeGrabHandle.parent;
    console.log(this.active);
    const width = this.active.clientWidth;

    this.active.classList.add('sortable-list__item_dragging');
    this.active.style.width = width + 'px';

    this.active.addEventListener('dragover', this.dragging);
    this.active.addEventListener('dragend', () => {
      this.active.classList.remove('sortable-list__item_dragging');
    });
  }

  dragging = event => {
    event.preventDefault();
    const currentElement = event.target;
    const isMoveable = this.active !== currentElement && currentElement.classList.contains(`sortable-list__item`);

    if (!isMoveable) {
      return;
    }

    const nextElement = this.getNextElement(event.clientY, currentElement);

    if (
      nextElement &&
      this.active === nextElement.previousElementSibling ||
      this.active === nextElement
    ) {
      return;
    }
    this.element.insertBefore(this.active, nextElement);
  }

  getNextElement (cursorPosition, currentElement) {
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

    return nextElement;
  }
}
