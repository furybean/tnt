require('./index.css');

class Notification {
  constructor(options) {
    this.title = 'Notification';
    this.message = 'Default message';
    this.duration = 5;
    this.closed = false;

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
      self.closed = true;
    }, 200);
  }

  doRender() {
    var self = this;
    var element = document.createElement('div');
    var group = document.createElement('div');
    var span = document.createElement('span');
    var p = document.createElement('p');
    var closeBtn = document.createElement('div');
    var showIcon = false;

    if (this.style === 'success'|| this.style === 'error' || this.style === 'info' || this.style === 'warn') {
      showIcon = true;
    }
    span.innerHTML = this.title;
    p.innerHTML = this.message;
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'closeBtn';
    group.className = 'group';
    element.className = 'notification';
    group.appendChild(span);
    group.appendChild(p);
    group.appendChild(closeBtn);
    element.appendChild(group);
    if (showIcon) {
      group.style.width = '230px';
      var div = document.createElement('div');
      div.className = 'icon ' + this.style;
      element.insertBefore(div, group);
    }

    closeBtn.addEventListener('click', function() {
      self.close(element);
    });

    var timer;
    timer = setTimeout(function() {
      if (!self.closed) {
        self.close(element);
      }
    }, self.duration * 1000);
    element.addEventListener('mouseenter', function() {
      clearTimeout(timer);
    });
    element.addEventListener('mouseleave', function() {
      timer = setTimeout(function() {
        if (!self.closed) {
          self.close(element);
        }
      }, self.duration * 1000);
    });

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

var seed = 1;

var notification = {
  instances: [],

  refreshLayout: function(notificationCount, startPosition, removedHeight) {
    for (var i = startPosition; i < notificationCount; i++) {
      this.instances[i].dom.style.top = parseInt(this.instances[i].dom.style.top) - removedHeight - 10 + 'px';
    }
  },

  open: function(options) {
    var self = this;
    options = options || {};
    var id = 'notification_' + seed++;
    var instance;
    var userOnClose = options.onClose;
    options.onClose = function() {
      self.close(instance || id);
      if (typeof userOnClose === 'function') {
        userOnClose.call(instance);
      }
    };

    instance = new Notification(options);
    instance.render();
    instance.id = id;

    var topDist = 0;
    var instances = this.instances;
    for (var i = 0, len = instances.length; i < len; i++) {
      topDist += instances[i].dom.offsetHeight + 10;
    }
    topDist += 10;
    instance.dom.style.top = topDist + 'px';
    instances.push(instance);

    return id;
  },

  success: function(options) {
    options.style = 'success';
    this.open(options);
  },

  warn: function(options) {
    options.style = 'warn';
    this.open(options);
  },

  info: function(options) {
    options.style = 'info';
    this.open(options);
  },

  error: function(options) {
    options.style = 'error';
    this.open(options);
  },

  close: function(key) {
    var removedHeight, i, len;
    var instances = this.instances;
    if (typeof key === 'string') {
      for (i = 0, len = instances.length; i < len; i++) {
        if (key === instances[i].id) {
          instances[i].close(instances[i].dom);
          return;
        }
      }
    }
    var index;
    for (i = 0, len = instances.length; i < len; i++) {
      if (key.id === instances[i].id) {
        index = i;
        removedHeight = instances[i].dom.offsetHeight;
        instances.splice(i, 1);
        break;
      }
    }
    if (len > 1) {
      this.refreshLayout(len - 1, index, removedHeight);
    }
  }
};

module.exports = notification;