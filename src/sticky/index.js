require('./index.css');

class Sticky {
  constructor(options) {
    this.top = 0;
    this.content = '';

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  doRender(parentNode) {
    var element = document.createElement('div');
    var phantomElement = document.createElement('div');

    element.className = 'btn btn-primary sticky';
    element.innerHTML = this.content;
    parentNode.appendChild(element);

    function getCurrentStyle(obj, prop) {
      if (obj.currentStyle) {
        return obj.currentStyle[prop];
      } else if (window.getComputedStyle) {
        prop = prop.toLowerCase();
        return document.defaultView.getComputedStyle(obj, null)[prop];
      }
      return null;
    }

    phantomElement.className = 'sticky-phantom';
    phantomElement.style.width = getCurrentStyle(element, 'width');
    phantomElement.style.height = getCurrentStyle(element, 'height');
    phantomElement.style.padding = getCurrentStyle(element, 'padding');
    phantomElement.style.margin = getCurrentStyle(element, 'margin');

    var originalWidth = phantomElement.style.width;
    var self = this;
    var fixed = false;
    var fixedPointTop = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0) + element.getBoundingClientRect().top - this.top;

    window.addEventListener('scroll', function() {
      var scrollTop = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
      if ((!fixed) && (element.getBoundingClientRect().top <= self.top)) {
        element.style.width = originalWidth;
        element.className = 'btn btn-primary sticky sticky-fixed';
        element.style.top = self.top + 'px';
        parentNode.appendChild(phantomElement);
        fixed = true;
      } else if ((fixed) && (scrollTop < fixedPointTop)){
        element.className = 'btn btn-primary sticky';
        if (phantomElement.parentNode) {
          phantomElement.parentNode.removeChild(phantomElement);
        }
        fixed = false;
      }
    });
  }

  render(parent) {
    if (!parent) {
      parent = document.body;
    }
    this.doRender(parent);
  }
}

module.exports = Sticky;