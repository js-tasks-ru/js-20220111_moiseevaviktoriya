let instance;

class Tooltip {
  element;

  constructor() {
    if (!instance) {
      instance = this;
    }
    this.initialize();
    this.render();
    return instance;
  }

  render() {
    this.element = document.createElement('div');
    document.body.append(this.element);
    //console.log(this.element)
  }

  initialize() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);
  }

  showTooltip = event => {
    const active = event.target.closest('[data-tooltip]');

    if (!active) {
      return;
    }

    this.element.classList.add('tooltip');
    this.element.innerHTML = active.dataset.tooltip;
    document.addEventListener("pointermove", this.moveTooltip);
  }

  moveTooltip = event => {
    let shiftX = event.clientX;
    let shiftY = event.clientY;

    this.element.style.left = shiftX + 'px';
    this.element.style.top = shiftY + 'px';
  }

  hideTooltip = () => {
    document.removeEventListener("pointermove", this.moveTooltip);
    this.destroy();
  }

  destroy() {
    this.element.classList.remove('tooltip');
    this.element.innerHTML = '';
  }
}

export default Tooltip;
