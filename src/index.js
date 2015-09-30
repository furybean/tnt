require('./css/iconfont.css');

var tnt = {
  Pagination: require('./pagination'),
  notification: require('./notification'),
  Alert: require('./alert'),
  DatePicker: require('./datepicker')
};

window.tnt = tnt;

module.exports = tnt;
