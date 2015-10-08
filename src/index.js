require('./css/iconfont.css');
require('./button/index.css');
require('./util');

var tnt = {
  Pagination: require('./pagination'),
  notification: require('./notification'),
  Alert: require('./alert'),
  DatePicker: require('./datepicker'),
  MessageBox: require('./msgbox/msgbox'),
  Popup: require('./popup')
};

window.tnt = tnt;

module.exports = tnt;
