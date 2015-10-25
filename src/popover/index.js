module.exports = {
  connect: function(dom, popup, trigger = 'mouseenter') {
    this.toggle = function() {
      if (popup.visibility) {
        popup.close();
      } else {
        popup.open();
      }
      popup.visibility = !popup.visibility;
    };

    if (trigger === 'mouseenter') {
      dom.addEventListener('mouseover', this.toggle);
      dom.addEventListener('mouseleave', this.toggle);
    }
    if (trigger === 'click') {
      dom.addEventListener('click', this.toggle);
    }
  },

  disconnect: function(dom, popup, trigger = 'mouseenter') {
    if (trigger === 'mouseenter') {
      dom.removeEventListener('mouseover', this.toggle);
      dom.removeEventListener('mouseleave', this.toggle);
    }
    if (trigger === 'click') {
      dom.removeEventListener('click', this.toggle);
    }
  }
};