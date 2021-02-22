class Tooltip {
  element;
  static instance;

  onMouseOver = (evt) => {
    const element = evt.target.closest('[data-tooltip]');
    const tooltipData = element.dataset.tooltip;

    if (element) {
      this.render(tooltipData);
      this.shiftTooltip(evt);

      document.addEventListener('pointermove', this.onMouseMove);
    }
  }

  onMouseOut = () => {
    this.removeTooltip();
  }

  onMouseMove = (evt) => {
    this.shiftTooltip(evt);
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }


  initEventListeners() {
    document.body.addEventListener('pointerover', this.onMouseOver);
    document.body.addEventListener('pointerout', this.onMouseOut);
  }

  shiftTooltip(evt) {
    const shift = 10;
    const posX = evt.clientX + shift;
    const posY = evt.clientY + shift;

    this.element.style.left = `${posX}px`;
    this.element.style.top = `${posY}px`;
  }

  getTooltipTemplate(data) {
    return `<div class="tooltip">${data}</div>`;
  }

  render(data) {
    const elementWrapper = document.createElement('div');

    elementWrapper.innerHTML = this.getTooltipTemplate(data);

    this.element = elementWrapper.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    this.initEventListeners();
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener('pointermove', this.onMouseMove);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeTooltip();
    document.removeEventListener('pointermove', this.onMouseOver);
    document.removeEventListener('pointermove', this.onMouseOut);
  }
}

const tooltip = new Tooltip();

export default tooltip;
