export default class RangePicker {
  element;
  subElements = {};
  isShown = false;

  constructor({
    from = new Date(),
    to = new Date()
  } = {}) {
    this.from = from;
    this.to = to;
    this.render();
  }

  render() {
    /*let date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
    let options = { month: 'long'};
    console.log(date.toLocaleDateString('ru-RU', options));*/

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.getInputs();
    this.initEventListeners();
  }

  getTemplate() {
    return `
        <div class="rangepicker">
          <div class="rangepicker__input" data-element="input">
            <span data-element="from"></span> -
            <span data-element="to"></span>
          </div>
          <div class="rangepicker__selector" data-element="selector">
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.renderMonth(true)}
            ${this.renderMonth()}
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

  getInputs() {
    const from = this.from.toLocaleString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit'});
    const to = this.to.toLocaleString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit'});
    this.subElements.from.innerHTML = from;
    this.subElements.to.innerHTML = to;
  }

  initEventListeners() {
    this.subElements.input.addEventListener('click', this.toggleOpened);
  }

  toggleOpened = () => {
    this.isShown = !!this.isShown;
    this.element.classList.toggle('rangepicker_open');
  }

  renderMonth(isFirstMonth = false) {
    let month;

    if (isFirstMonth) {
      month = this.from.toLocaleString('ru-RU', {month: 'long'});
    } else {

    }

    return `
        <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
                <time datetime="November">${month}</time>
            </div>
            ${this.getWeekTemplate()}
           <div class="rangepicker__date-grid">
                ${this.getDateTemplate()}
           </div>
        </div>
    `;
  }

  getWeekTemplate() {
    return `
      <div class="rangepicker__day-of-week">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
    `;
  }

  getDateTemplate() {
    let firstDate = new Date(this.from.getFullYear(), this.from.getMonth());
    const arr = [];

    while (firstDate.getMonth() === this.from.getMonth()) {
      arr.push(new Date(this.from.getFullYear(), this.from.getMonth(), firstDate.getDate()));
      firstDate.setDate(firstDate.getDate() + 1);
    }

    return arr.map((item, index) => {
      return `
        <button type="button" class="${this.getClass(item)}"
                data-value="${item.toISOString()}"
                ${index === 0 ? this.getDayOfWeek(item) : ''}>
                    ${item.getDate()}
        </button>
      `;
    }).join('');
  }

  getDayOfWeek(item) {
    return `style="--start-from: ${item.getDay()}"`;
  }

  getClass(item) {
    let classStr = 'rangepicker__cell';

    if (+item === +this.from) {
      classStr += ' rangepicker__selected-from';
    } else if (+item > +this.from && +item < +this.to) {
      classStr += ' rangepicker__selected-between';
    } else if (+item === +this.to) {
      classStr += ' rangepicker__selected-to';
    }
    return classStr;
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
    this.subElements = {};
  }
}
