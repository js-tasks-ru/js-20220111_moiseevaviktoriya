export default class ColumnChart {
  chartHeight = 50;
  bodyChart = null;
  element;
  isLoading = true;

  constructor(options) {
    this.data = options?.data || [];
    this.label = options?.label || '';
    this.value = options?.value || 0;
    this.link = options?.link || '';
    this.formatHeading = options?.formatHeading || ((data) => data);

    this.render();
  }

  getTemplate() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label} ${this.getLink()}
        </div>

        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading ? this.formatHeading(this.value) : this.value}
          </div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.bodyChart = element.querySelector('.column-chart__chart');

    this.chartsLoaded();
    this.renderChartElements();
  }

  renderChartElements() {
    this.bodyChart.innerHTML = this.getChartElements();
  }

  getLink() {
    return this.link ? `
       <a href=${this.link} class="column-chart__link">View all</a>
    ` : '';
  }

  chartsLoaded() {
    if (this.data.length) {
      this.isLoading = false;
      this.element.classList.remove('column-chart_loading');
    }
  }

  getChartElements() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    const chartElements = this.data.map(item => {
      let percent = (item / maxValue * 100).toFixed(0) + '%';
      let value = String(Math.floor(item * scale));
      return `<div style="--value: ${value}" data-tooltip=${percent}></div>`;
    });

    return chartElements.join('');
  }

  destroy() {
    this.element.remove();
  }

  remove() {
    this.element.remove();
  }

  update(newData) {
    this.data = newData;
    this.renderChartElements();
  }
}
