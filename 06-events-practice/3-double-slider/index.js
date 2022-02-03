export default class DoubleSlider {
  element;
  subElements = {};
  activeThumb;
  shiftX;

  constructor({
    min = 10,
    max = 100,
    formatValue = ((data) => data),
    selected = {
      from: min,
      to: max
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {
      from: selected.from,
      to: selected.to
    };

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
    const range = this.max - this.min;
    const thumbLeftPosition = this.subElements.thumbLeft.style.left ? parseFloat(this.subElements.thumbLeft.style.left) : 0;
    const thumbRightPosition = this.subElements.thumbRight.style.right ? parseFloat(this.subElements.thumbRight.style.right) : 0;
    this.selected.from = Math.round(this.min + thumbLeftPosition * range / 100);
    this.selected.to = Math.round(this.max - thumbRightPosition * range / 100);
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
    this.getValues();

  };


  stopDragging = event => {
    document.removeEventListener("pointermove", this.dragging);
    this.element.classList.remove('range-slider_dragging');
  };


  destroy() {
    this.element.remove();
    this.subElements = {};
  }
}
