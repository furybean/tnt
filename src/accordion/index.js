require('./index.css');

class Accordion {
  constructor(options) {
    this.section = [];

    for (let i = 0, len = options.length; i < len; i++) {
      this.section.push({
        title: '',
        content: '',
        active: false,
        disabled: false
      });

      for (var prop in options[i]) {
        if (options[i].hasOwnProperty(prop)) {
          this.section[i][prop] = options[i][prop];
        }
      }
    }
  }

  doRender(parentNode) {
    function getCurrentStyle(obj, prop) {
      if (obj.currentStyle) {
        return obj.currentStyle[prop];
      } else if (window.getComputedStyle) {
        prop = prop.toLowerCase();
        return document.defaultView.getComputedStyle(obj, null)[prop];
      }
      return null;
    }

    var element = document.createElement('div');
    element.className = 'accordion';
    parentNode.appendChild(element);

    for (var i = 0, len = this.section.length; i < len; i++) {
      var section = document.createElement('div');
      section.className = 'section';
      var header = document.createElement('h3');
      header.innerHTML = this.section[i].title;
      header.className = 'header fa fa-angle-right';
      var contentWrap = document.createElement('div');
      contentWrap.className = 'content-wrap';
      var content = document.createElement('p');
      content.innerHTML = this.section[i].content;
      content.className = 'content';

      section.appendChild(header);
      contentWrap.appendChild(content);
      section.appendChild(contentWrap);
      element.appendChild(section);

      if (this.section[i].active) {
        section.className += ' active';
        contentWrap.style.height = getCurrentStyle(content, 'height');
      }

      if (this.section[i].disabled) {
        section.className += ' disabled';
      } else {
        header.addEventListener('click', (function(section, contentWrap, content) {
          return function() {
            if (section.className.indexOf('active') > -1) {
              section.classList.remove('active');
              contentWrap.style.height = '0';
            } else {
              section.classList.add('active');
              contentWrap.style.height = getCurrentStyle(content, 'height');
            }
          }
        }(section, contentWrap, content)));
      }
    }
  }

  render(parent) {
    if (!parent) {
      parent = document.body;
    }
    this.doRender(parent);
  }
}

module.exports = Accordion;