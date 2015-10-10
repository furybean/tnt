require('./util');
require('./css/iconfont.css');
require('./button/index.css');


var tnt = {
  Pagination: require('./pagination'),
  notification: require('./notification'),
  Alert: require('./alert'),
  DatePicker: require('./datepicker'),
  MessageBox: require('./msgbox/msgbox'),
  Popup: require('./popup'),
  FormField: require('./form-field')
};

window.tnt = tnt;

module.exports = tnt;
