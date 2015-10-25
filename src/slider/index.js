require('./index.css');

class Slider {
  constructor(options) {
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.defaultValue = 0;
    this.showInput = false;

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  doRender() {
    var wrapper = document.createElement('div');
    var element = document.createElement('div');
    var bar = document.createElement('div');
    var button = document.createElement('div');
    var popUp = document.createElement('div');

    element.className = 'slider';
    bar.className = 'bar';
    bar.style.width = (this.defaultValue - this.min) / (this.max - this.min) * 100 + '%';
    button.className = 'button';
    button.style.left = (this.defaultValue - this.min) / (this.max - this.min) * 100 + '%';
    popUp.className = 'pop-up';
    popUp.innerHTML = this.defaultValue;
    button.appendChild(popUp);
    element.appendChild(bar);
    element.appendChild(button);
    wrapper.appendChild(element);

    if (this.showInput) {
      element.className += ' show-input';
      var input = document.createElement('input');
      input.value = this.defaultValue;
      wrapper.appendChild(input);
    }


    function getCurrentStyle(obj, prop) {
      if (obj.currentStyle) {
        return obj.currentStyle[prop];
      } else if (window.getComputedStyle) {
        prop = prop.toLowerCase();
        return document.defaultView.getComputedStyle(obj, null)[prop];
      }
      return null;
    }

    function setNewPosition(newPos) {
      if ((newPos >= 0) && (newPos <= 100)) {
        var steps = Math.round(newPos / lengthPerStep);
        button.style.left = steps * lengthPerStep + '%';
        bar.style.width = button.style.left;
        var currentValue = parseInt(button.style.left) * (self.max - self.min) * 0.01 + self.min;
        popUp.innerHTML = currentValue;
        if (self.showInput) {
          input.value = currentValue;
        }
      }
    }

    var dragging = false;
    var startX = 0;
    var currentX = 0;
    var startPos = 0;
    var self = this;
    var lengthPerStep = 100 / ((self.max - self.min) / self.step);

    //拖动按钮相关事件
    button.addEventListener('mousedown', function(event) {
      dragging = true;
      popUp.className += ' active';
      startX = event.clientX;
      startPos = (parseInt(getCurrentStyle(button, 'left')) / parseInt(getCurrentStyle(element, 'width'))) * 100;
    });

    window.addEventListener('mouseup', function() {
      dragging = false;
      popUp.className = 'pop-up';
    });

    window.addEventListener('mousemove', function(event) {
      if (dragging) {
        currentX = event.clientX;
        var diff = (currentX - startX) / (parseInt(getCurrentStyle(element, 'width'))) * 100;
        var newPos = startPos + diff;
        setNewPosition(newPos);
      }
    });

    //直接点击滑动条上某一点的事件
    element.addEventListener('click', function(event) {
      currentX = event.clientX;
      var newPos = (currentX - this.offsetLeft) / (parseInt(getCurrentStyle(element, 'width'))) * 100;
      setNewPosition(newPos);
    });

    //改变输入框中数字时的事件
    if (this.showInput) {
      input.addEventListener('keyup', function() {
        if (this.value === '') {
          return;
        }
        if (!isNaN(this.value)) {
          console.log((this.value - self.min) * 100 / (self.max - self.min));
          setNewPosition((this.value - self.min) * 100 / (self.max - self.min));
        }
      })
    }

    return wrapper;
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

module.exports = Slider;