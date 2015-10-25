var IncrementalDOM = require('../lib/incremental-dom'),
  elementOpen = IncrementalDOM.elementOpen,
  elementClose = IncrementalDOM.elementClose,
  elementVoid = IncrementalDOM.elementVoid,
  text = IncrementalDOM.text;

require('./index.css');

var Component = require('../Component');

class FormField extends Component {
  doRender() {
    var self = this;
    var className;
    var isError = self.hintType === 'error';
    if (isError) {
      className = 'iconfont icon-formfield-error';
    } else if (self.hintType === 'warning') {
      className = 'iconfont icon-formfield-warning';
    }

    return (
      <div class={ isError ? 'formfield ' + 'validate-error' : 'formfield' }>
        <label>{ this.label || '' }</label>
        <div>
          <input type="text" />
          <div class="formfield-hint">
            <i class={ className }></i>{ self.hintMessage }
          </div>
        </div>
      </div>
    );
  }

  doRenderEditor() {
    return (<input type="text" />);
  }
}

module.exports = FormField;
