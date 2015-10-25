require('./css/iconfont.css');
require('./button/index.css');
require('./util');

var tnt = {
  Pagination: require('./pagination'),
  notification: require('./notification'),
  Alert: require('./alert'),
  DatePicker: require('./datepicker'),
  MessageBox: require('./msgbox/msgbox'),
  Popup: require('./popup'),
  Popover: require('./popover'),
  Dropdown: require('./dropdown').Dropdown,
  DropdownItem: require('./dropdown').DropdownItem,
  Progress: require('./progress'),
  Slider: require('./slider'),
  FormField: require('./form-field')
};

window.tnt = tnt;

module.exports = tnt;
