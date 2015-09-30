require('./index.css');

class Alert {
  constructor(options) {
    this.title = 'Alert';
    this.style = 'info';
    this.closable = false;

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  close() {
    var self = this;
    this.dom.style.opacity = 0;
    setTimeout(function() {
      if (self.onClose) {
        self.onClose();
      }
      self.dom.parentNode.removeChild(self.dom);
    }, 200);
  }

  doRender() {
    var self = this;
    var element = document.createElement('div');
    var group = document.createElement('div');
    var span = document.createElement('span');
    span.innerHTML = this.title;
    group.className = 'group';
    element.className = 'alert ' + this.style;
    group.appendChild(span);
    if (this.message) {
      var p = document.createElement('p');
      p.innerHTML = this.message;
      group.appendChild(p);
    }
    element.appendChild(group);
    var div = document.createElement('div');
    div.className = 'icon ' + this.style;
    element.insertBefore(div, group);

    if (this.closable) {
      var closeBtn = document.createElement('div');
      closeBtn.innerHTML = this.closeText || '&times;';
      closeBtn.className = 'closeBtn';
      if (this.closeText) {
        closeBtn.className += ' custom';
      }
      group.appendChild(closeBtn);
      closeBtn.addEventListener('click', function() {
        self.close(element);
      });
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

var alert = {
  open: function(options) {
    options = options || {};
    var instance;
    var userOnClose = options.onClose;
    options.onClose = function() {
      if (typeof userOnClose === 'function') {
        userOnClose.call(instance);
      }
    };

    instance = new Alert(options);
    instance.render();
  }
};

module.exports = alert;