require('./msgbox.css');

var Popup = require('../popup');
var util = require('../util');

var IncrementalDOM = require('incremental-dom'),
  elementOpen = IncrementalDOM.elementOpen,
  elementClose = IncrementalDOM.elementClose,
  elementVoid = IncrementalDOM.elementVoid,
  text = IncrementalDOM.text,
  patch = IncrementalDOM.patch;

// 考虑边界情况较少，仅供内部使用。
var buildDOM = function(config) {
  if (!config) return;

  if (config instanceof Array) {
    config.forEach(function(item) {
      buildDOM(item);
    });

    return;
  }

  var tag = config.tag;

  if (tag) {
    var content = config.content;
    var key = null;
    var props = [];

    for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
        if (prop === 'content' || prop === 'tag') continue;
        if (prop === 'key') {
          key = config[prop];
        }
        props.push(prop === 'className' ? 'class' : prop, config[prop]);
      }
    }

    props.splice.call(props, 0, 0, tag, key, null);

    //console.log(props);

    if (!content) {
      elementVoid.apply(null, props);

      return;
    } else {
      elementOpen.apply(null, props);
    }

    if (content instanceof Array) {
      for (var i = 0, j = content.length; i < j; i++) {
        var child = content[i];
        buildDOM(child);
      }
    } else if (typeof content === 'string') {
      text(content);
    }
    elementClose(tag);
  }
};

var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

var STATUS_CLASS_MAP = {
  '': '',
  success: 'icon-msgbox-success',
  warning: 'icon-msgbox-warning',
  error: 'icon-msgbox-error'
};

var CONFIRM_BUTTON_CLASS = 'btn-primary btn-lg msgbox-confirm';

var MessageBoxConstructor = {
  getPopupOptions: function() {
    return {
      target: 'center',
      modal: true,
      updatePositionOnResize: true,
      showAnimation: 'pop',
      hideDelay: 1,
      hideOnPressEscape: true,
      hideOnClickModal: true
    };
  },

  options: {
    title: '',
    message: '',
    type: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: CONFIRM_TEXT,
    cancelButtonText: CANCEL_TEXT,
    confirmButtonClass: '',
    confirmButtonDisabled: false,
    cancelButtonClass: '',

    callback: null
  },

  set: function(prop, value) {
    if (prop !== null && typeof prop === 'object') {
      var props = prop;
      for (var p in props) {
        if (props.hasOwnProperty(p)) {
          this.set(p, props[p]);
        }
      }
    } else if (typeof prop === 'string') {
      this.options[prop] = value;
    }
  },

  get: function(prop) {
    return this.options[prop];
  },

  refresh: function() {
    this.doRefresh(this.dom);
  },

  handleAction: function(action) {
    var self = this;
    var callback = self.get('callback');
    self.close();
    callback(action);
  },

  doRefresh: function(dom) {
    var self = this;

    patch(dom, function() {
      var confirmButtonClass = self.get('confirmButtonClass') || '';
      var cancelButtonClass = self.get('cancelButtonClass') || '';

      buildDOM([{
        tag: 'div',
        className: 'msgbox-close icon-close',
        key: 'close',
        onclick: function() {
          self.handleAction('close');
        }
      }, {
        tag: 'div',
        className: 'msgbox-content',
        content: [{
          tag: 'div',
          className: 'msgbox-status ' + STATUS_CLASS_MAP[self.get('type')],
          key: 'status'
        }, {
          tag: 'div',
          className: 'msgbox-title',
          content: self.get('title'),
          key: 'title'
        }, {
          tag: 'div',
          className: 'msgbox-message',
          content: self.get('message'),
          key: 'message'
        }]
      }, {
        tag: 'div',
        className: 'msgbox-btns',
        key: 'btns',
        content: [{
          tag: 'button',
          className: confirmButtonClass ? CONFIRM_BUTTON_CLASS + ' ' + confirmButtonClass : CONFIRM_BUTTON_CLASS,
          content: self.get('confirmButtonText') || CONFIRM_TEXT,
          key: 'confirm',
          style: {
            display: self.get('showConfirmButton') ? '' : 'none'
          },
          onclick: function() {
            self.handleAction('confirm');
          }
        }, {
          tag: 'button',
          className: cancelButtonClass ? 'msgbox-cancel ' + cancelButtonClass : 'msgbox-cancel',
          content: self.get('cancelButtonText') || CANCEL_TEXT,
          key: 'cancel',
          style: {
            display: self.get('showCancelButton') ? '' : 'none'
          },
          onclick: function() {
            self.handleAction('cancel');
          }
        }]
      }]);
    });
  },

  getDOM: function() {
    var self = this;
    if (!this.dom) {
      var dom = document.createElement('div');
      dom.className = 'msgbox';

      this.dom = dom;

      self.doRefresh(dom);
    }

    return this.dom;
  }
};

Popup(MessageBoxConstructor);

var defaults = {
  title: '',
  message: '',
  type: 'success',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT,
  confirmButtonClass: '',
  cancelButtonClass: '',
  buttons: null
};

var instance = MessageBoxConstructor;
var currentMsg = null;
var msgQueue = [];

instance.set('callback', function(action) {
  var result;
  if (currentMsg) {
    var callback = currentMsg.callback;
    if (typeof callback === 'function') {
      result = callback(action);
    }
  }
  if (result !== false) {
    showNextMsg();
  } else {
    return false;
  }
});

var showNextMsg = function() {
  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift();

      var oldVisible = instance.visible;
      instance.visible = false;
      instance.set(currentMsg.options);
      instance.visible = oldVisible;

      instance.open();
      instance.refresh();
    }
  }
};

var MessageBox = function(options, callback) {
  if (typeof options === 'string') {
    options = {
      title: options
    };
    if (arguments[1]) {
      options.message = arguments[1];
    }
    if (arguments[2]) {
      options.type = arguments[2];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }
  msgQueue.push({
    options: util.merge({}, defaults, MessageBox.defaults || {}, options),
    callback: callback
  });
  showNextMsg();
};

MessageBox.setDefaults = function(defaults) {
  MessageBox.defaults = defaults;
};

MessageBox.close = function() {
  instance.close();
  msgQueue = [];
  currentMsg = null;
};

module.exports = MessageBox;
