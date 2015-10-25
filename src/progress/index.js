require('./index.css');

class Progress {
  constructor(options) {
    this.percent = 0;
    this.style = 'info';
    this.showInfo = true;
    this.barHeight = 15;

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  doRender() {
    var element = document.createElement('div');
    var bar = document.createElement('div');
    var activeBar = document.createElement('div');

    element.className = 'progress';
    bar.className = 'bar ' + this.style;
    bar.style.height = this.barHeight + 'px';
    activeBar.className = 'active-bar';
    activeBar.style.height = this.barHeight + 'px';
    activeBar.style.width = this.percent + '%';
    bar.appendChild(activeBar);
    element.appendChild(bar);

    if (this.showInfo) {
      bar.className += ' show-info';
      var span = document.createElement('span');
      span.innerHTML = this.percent + '%';
      span.style.height = this.barHeight + 'px';
      span.style.lineHeight = this.barHeight + 'px';
      element.appendChild(span);
    }

    return element;
  }

  render(parent) {
    if (!parent) {
      parent = document.body;
    }
    var dom = this.doRender();
    parent.appendChild(dom);
    this.dom = dom;
  }
}

module.exports = Progress;