require('./index.css');

class Notification {
  constructor(options) {
    this.title = 'Notification';
    this.message = 'Default message';
    this.duration = 5;
    this.notificationCount = 0;
    this.closed = false;

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  updateNotificationCount() {
    return document.getElementsByClassName('notification').length;
  }

  refreshLayout(notificationCount, startPos, notificationArr, initHeight) {
    for (var i = startPos; i < notificationCount; i++) {
      notificationArr[i].style.top = parseInt(notificationArr[i].style.top) - initHeight - 10 + 'px';
    }
  }

  closeNotification(notification) {
    var self = this;
    var index;
    var initHeight;
    notification.style.opacity = 0;
    setTimeout(function() {
      var notificationArr = document.getElementsByClassName('notification');
      for (var i = 0, len = self.updateNotificationCount(); i < len; i++) {
        if (notification === notificationArr[i]) {
          index = i;
          break;
        }
      }
      initHeight = notification.offsetHeight;
      notification.parentNode.removeChild(notification);
      self.closed = true;
      if (self.onClose) {
        self.onClose();
      }
      if (len > 1) {
        self.refreshLayout(len - 1, index, notificationArr, initHeight);
      }
    }, 200);
  }

  init() {
    var self = this;
    var element = document.createElement('div');
    var group = document.createElement('div');
    var span = document.createElement('span');
    var p = document.createElement('p');
    var closeBtn = document.createElement('div');
    var icon = false;
    var timeout;
    if (this.style === 'success'|| this.style === 'error' || this.style === 'info' || this.style === 'warn') {
      icon = true;
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
    if (icon) {
      group.style.width = '230px';
      var div = document.createElement('div');
      div.className = 'icon ' + this.style;
      element.insertBefore(div, group);
    }
    this.notificationCount = this.updateNotificationCount();
    var notificationArr = document.getElementsByClassName('notification');
    var topDist = 0;
    for (var i = 0, len = this.notificationCount; i < len; i++) {
      topDist += notificationArr[i].offsetHeight + 10;
    }
    topDist += 10;
    element.style.top = topDist + 'px';
    closeBtn.addEventListener('click', function() {
      self.closeNotification(element);
    });
    timeout = setTimeout(function() {
      if (!self.closed) {
        self.closeNotification(element);
      }
    }, self.duration * 1000);
    element.addEventListener('mouseenter', function() {
      clearTimeout(timeout);
    });
    element.addEventListener('mouseleave', function() {
      timeout = setTimeout(function() {
        if (!self.closed) {
          self.closeNotification(element);
        }
      }, self.duration * 1000);
    });
    return element;
  }

  render(parent) {
    if (!parent) parent = document.body;
    var script = parent.getElementsByTagName('script');
    if (script) {
      parent.insertBefore(this.init(), script[0]);
    } else {
      parent.appendChild(this.init());
    }
  }
}

module.exports = Notification;