export default class DoubleSlider {
  element;
  subElements = {};
  activeThumb;
  shiftX;
  range;

  constructor({
    min = 100,
    max = 200,
    formatValue = ((data) => data),
    selected = {
      from: min,
      to: max
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.range = max - min;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.initEventListeners();
    this.getValues();
  }

  getTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from"></span>
        <div class="range-slider__inner" data-element="inner">
          <span class="range-slider__progress" data-element="progressBar"></span>
          <span class="range-slider__thumb-left" data-element="thumbLeft"></span>
          <span class="range-slider__thumb-right" data-element="thumbRight"></span>
        </div>
        <span data-element="to"></span>
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

  getValues() {
    const left = (this.selected.from - this.min) * 100 / this.range;
    const right = 100 - (this.selected.to - this.min) * 100 / this.range;
    this.subElements.progressBar.style.left = left + '%';
    this.subElements.progressBar.style.right = right + '%';
    this.subElements.thumbLeft.style.left = left + '%';
    this.subElements.thumbRight.style.right = right + '%';
    this.subElements.from.innerHTML = this.formatValue(this.selected.from);
    this.subElements.to.innerHTML = this.formatValue(this.selected.to);
  }

  setValues() {
    const thumbLeftPosition = parseFloat(this.subElements.thumbLeft.style.left);
    const thumbRightPosition = parseFloat(this.subElements.thumbRight.style.right);
    this.selected.from = Math.round(this.min + thumbLeftPosition * this.range / 100);
    this.selected.to = Math.round(this.max - thumbRightPosition * this.range / 100);
    this.subElements.from.innerHTML = this.formatValue(this.selected.from);
    this.subElements.to.innerHTML = this.formatValue(this.selected.to);
  }

  initEventListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.startDragging);
    this.subElements.thumbRight.addEventListener('pointerdown', this.startDragging);
  }

  startDragging = event => {
    this.activeThumb = event.target;
    this.element.classList.add('range-slider_dragging');
    document.addEventListener("pointermove", this.dragging);
    document.addEventListener("pointerup", this.stopDragging);
  };

  dragging = event => {
    const isLeftThumb = this.activeThumb === this.subElements.thumbLeft;
    const innerRect = this.subElements.inner.getBoundingClientRect();
    const innerWidth = this.subElements.inner.offsetWidth;
    const thumbRightRect = this.subElements.thumbRight.getBoundingClientRect();
    const thumbLeftRect = this.subElements.thumbLeft.getBoundingClientRect();

    if (isLeftThumb) {
      this.shiftX = (event.clientX - innerRect.left) * 100 / innerWidth;

      if (this.shiftX < 0) {
        this.shiftX = 0;
      }

      if (this.shiftX > (thumbRightRect.left - innerRect.left) * 100 / innerWidth) {
        this.shiftX = (thumbRightRect.left - innerRect.left) * 100 / innerWidth;
      }

      this.activeThumb.style.left = this.shiftX + '%';
      this.subElements.progressBar.style.left = this.shiftX + '%';
    } else {
      this.shiftX = (innerRect.right - event.clientX) * 100 / innerWidth;

      if (this.shiftX < 0) {
        this.shiftX = 0;
      }

      if (this.shiftX > (innerRect.right - thumbLeftRect.right) * 100 / innerWidth) {
        this.shiftX = (innerRect.right - thumbLeftRect.right) * 100 / innerWidth;
      }

      this.activeThumb.style.right = this.shiftX + '%';
      this.subElements.progressBar.style.right = this.shiftX + '%';
    }
    this.setValues();
  };


  stopDragging = event => {
    document.removeEventListener("pointermove", this.dragging);
    document.removeEventListener("pointerup", this.stopDragging);
    this.element.classList.remove('range-slider_dragging');
  };


  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}
