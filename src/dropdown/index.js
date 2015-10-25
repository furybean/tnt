require('./index.css');

class Dropdown {
  constructor(options) {
    this.items = [];
    this.visibility = false;
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  getDOM() {
    if (!this.dom) {
      this.render();
    }
    return this.dom;
  }

  doRender() {
    this.dom = document.createElement('ul');
    for (var i = 0, len = this.items.length; i < len; i++) {
      this.dom.appendChild(this.items[i].render());
    }
    this.dom.className = 'dropdown';
    return this.dom;
  }

  render(parent) {
    if (!parent) {
      parent = document.body;
    }
    parent.appendChild(this.doRender());
  }
}

require('../popup')(Dropdown.prototype);

class DropdownItem {
  constructor(options) {
    this.text = '';
    this.divider = false;
    this.disabled = false;
    this.dom = document.createElement('li');

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  render() {
    if (!this.divider) {
      this.dom.className = 'dropdown-item';
      this.dom.innerHTML = this.text;
      if (this.disabled) {
        this.dom.className += ' dropdown-item-disabled';
      }
    } else {
      this.dom = document.createElement('hr');
    }
    return this.dom;
  }
}

module.exports = {
  Dropdown: Dropdown,
  DropdownItem: DropdownItem
};