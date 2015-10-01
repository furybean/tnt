var IncrementalDOM = require('../lib/incremental-dom'),
  patch = IncrementalDOM.patch,
  patchOne = IncrementalDOM.patchOne;

class Component {
  render(parent) {
    var fragment = document.createDocumentFragment();

    patch(fragment, this.doRender.bind(this));

    this.dom = fragment.firstChild;

    if (parent) {
      parent.appendChild(fragment);
    }
  }

  refresh() {
    patchOne(this.dom, this.doRender.bind(this));
  }
}

module.exports = Component;