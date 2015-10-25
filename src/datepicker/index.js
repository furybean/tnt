var IncrementalDOM = require('../lib/incremental-dom'),
  elementOpen = IncrementalDOM.elementOpen,
  elementClose = IncrementalDOM.elementClose,
  elementVoid = IncrementalDOM.elementVoid,
  text = IncrementalDOM.text;

var getDayCountOfMonth = function (year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }

  if (month === 1) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  }

  return 31;
};

var getFirstDayOfMonth = function (date) {
  var temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
};

var getDateTableState = function (date) {
  var day = getFirstDayOfMonth(date);
  var maxDay = getDayCountOfMonth(date.getFullYear(), date.getMonth());
  var lastMonthDay = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));

  day = (day === 0 ? 7 : day);

  var cells = [];
  var count = 1;
  var firstDayPosition;

  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 7; j++) {
      var cell = {
        row: i,
        column: j,
        type: 'normal'
      };
      if (i === 0) {
        if (j >= day) {
          cell.text = count++;
          if (count === 2) {
            firstDayPosition = i * 7 + j;
          }
        } else {
          cell.text = lastMonthDay - (day - j % 7) + 1;
          cell.type = 'prevmonth';
        }
      } else {
        if (count <= maxDay) {
          cell.text = count++;
          if (count === 2) {
            firstDayPosition = i * 7 + j;
          }
        } else {
          cell.text = count++ - maxDay;
          cell.type = 'nextmonth';
        }
      }
      cells.push(cell);
    }
  }

  cells.firstDayPosition = firstDayPosition;

  return cells;
};

require('./index.css');

var days = ['日', '一', '二', '三', '四', '五', '六'];

var Component = require('../Component');

class DatePicker extends Component {
  constructor() {
    super();
    this.date = new Date();
    this.currentView = 'date';
  }

  showMonthPicker() {
    this.currentView = 'month';
    this.refresh();
  }

  showYearPicker() {
    this.currentView = 'year';
    this.refresh();
  }

  handleLabelClick() {
    if (this.currentView === 'date') {
      this.showMonthPicker();
    } else if (this.currentView === 'month') {
      this.showYearPicker();
    }
  }

  prevMonth() {
    var date = this.date;
    var year = date.getFullYear();
    var month = date.getMonth();

    var newYear = month === 0 ? year - 1 : year;
    var newMonth = month === 0 ? 11 : month - 1;

    date.setMonth(newMonth);
    date.setFullYear(newYear);

    this.refresh();
  }

  nextMonth() {
    var date = this.date;
    var year = date.getFullYear();
    var month = date.getMonth();

    var newYear = month === 11 ? year + 1 : year;
    var newMonth = month === 11 ? 0 : month + 1;

    date.setMonth(newMonth);
    date.setFullYear(newYear);

    this.refresh();
  }

  nextYear() {
    var date = this.date;
    date.setFullYear(date.getFullYear() + 1);
    this.refresh();
  }

  prevYear() {
    var date = this.date;
    date.setFullYear(date.getFullYear() - 1);
    this.refresh();
  }

  nextTenYear() {
    var date = this.date;
    date.setFullYear(date.getFullYear() + 10);
    this.refresh();
  }

  prevTenYear() {
    var date = this.date;
    date.setFullYear(date.getFullYear() - 10);
    this.refresh();
  }

  prev() {
    var currentView = this.currentView;
    if (currentView === 'date') {
      this.prevMonth();
    } else {
      this.prevYear();
    }
  }

  next() {
    var currentView = this.currentView;
    if (currentView === 'date') {
      this.nextMonth();
    } else {
      this.nextYear();
    }
  }

  handleMonthTableClick(event) {
    var target = event.target;
    if (target.tagName === 'TD') {
      var column = target.cellIndex;
      var row = target.parentNode.rowIndex;
      var month = row * 3 + column;

      this.date.setMonth(month);
      this.currentView = 'date';
      this.refresh();
    }
  }

  handleDateTableClick(event) {
    var target = event.target;
    if (target.tagName === 'TD') {
      var month = this.date.getMonth();
      var text = target.textContent || target.innerText;
      var className = target.className;

      if (className.indexOf('prev') !== -1) {
        if (month === 0) {
          month = 11;
        } else {
          month = month - 1;
        }
        this.date.setMonth(month);
      } else if (className.indexOf('next') !== -1) {
        if (month === 11) {
          month = 0;
        } else {
          month = month + 1;
        }
        this.date.setMonth(month);
      }
      this.date.setDate(parseInt(text, 10));

      this.refresh();
    }
  }

  handleYearTableClick(event) {
    var target = event.target;
    if (target.tagName === 'TD') {
      var column = target.cellIndex;
      var row = target.parentNode.rowIndex;
      var index = row * 3 + column;

      if (index === 0 || index === 11) return;

      var textYear = target.textContent || target.innerText;
      this.date.setFullYear(parseInt(textYear));

      this.currentView = 'month';
      this.refresh();
    }
  }

  changeToToday() {
    this.date.setTime(+new Date());
    this.refresh();
  }

  doRender() {
    var rows = [0, 1, 2, 3, 4, 5, 6];
    var columns = [0, 1, 2, 3, 4, 5, 6];
    var self = this;
    var date = self.date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var monthDate = date.getDate();

    var cells = getDateTableState(self.date);

    var currentView = this.currentView;
    var label = '';

    switch (currentView) {
      case 'date':
        label = year + ' / ' + month;
        break;
      case 'month':
      case 'year':
        label = year;
        break;
    }

    var startYear = Math.floor(year / 10) * 10;

    return (<div class="datepicker">

      <div class="datepicker-header">
        <button onclick={ self.prev.bind(self) } class="datepicker-prevbtn iconfont icon-datepicker-left-arrow"></button>
        <label onclick={ self.handleLabelClick.bind(self) }>{ label }</label>
        <button onclick={ self.next.bind(self) } class="datepicker-nextbtn iconfont icon-datepicker-right-arrow"></button>
      </div>
      <div class="datepicker-body">
        <table class={ self.currentView === 'date' ? '' : 'hidden' } onclick={ self.handleDateTableClick.bind(self) }>
          <tbody>
          {
            rows.forEach(function (row, i) {
              return (<tr>
                {
                  columns.forEach(function (column, j) {
                    if (i === 0) return (<th>{ days[j] }</th>);

                    var cell = cells[(i - 1) * 7 + j];

                    if (cell.type !== 'normal') {
                      return (<td class={ cell.type }>{ cell.text }</td>);
                    } else {
                      return (<td class={ monthDate === cell.text ? 'current' : '' }>{ cell.text }</td>);
                    }
                  })
                }
              </tr>);
            })
          }
          </tbody>
        </table>

        <table onclick={ self.handleYearTableClick.bind(self) }
               class={ self.currentView === 'year' ? 'datepicker-yeartable' : 'datepicker-yeartable hidden' }>
          <tbody>
          <tr>
            <td onclick={ self.prevTenYear.bind(self) } class="icon-arrow-left"></td>
            <td class={ year === startYear ? 'current' : '' }>{startYear}</td>
            <td class={ year === startYear + 1 ? 'current' : '' }>{startYear + 1}</td>
          </tr>
          <tr>
            <td class={ year === startYear + 2 ? 'current' : '' }>{startYear + 2}</td>
            <td class={ year === startYear + 3 ? 'current' : '' }>{startYear + 3}</td>
            <td class={ year === startYear + 4 ? 'current' : '' }>{startYear + 4}</td>
          </tr>
          <tr>
            <td class={ year === startYear + 5 ? 'current' : '' }>{startYear + 5}</td>
            <td class={ year === startYear + 6 ? 'current' : '' }>{startYear + 6}</td>
            <td class={ year === startYear + 7 ? 'current' : '' }>{startYear + 7}</td>
          </tr>
          <tr>
            <td class={ year === startYear + 8 ? 'current' : '' }>{startYear + 8}</td>
            <td class={ year === startYear + 9 ? 'current' : '' }>{startYear + 9}</td>
            <td onclick={ self.nextTenYear.bind(self) } class="icon-arrow-right"></td>
          </tr>
          </tbody>
        </table>

        <table onclick={ self.handleMonthTableClick.bind(self) }
               class={ self.currentView === 'month' ? 'datepicker-monthtable' : 'datepicker-monthtable hidden' }>
          <tbody>
          <tr>
            <td class={ month === 1 ? 'current' : '' }>1月</td>
            <td class={ month === 2 ? 'current' : '' }>2月</td>
            <td class={ month === 3 ? 'current' : '' }>3月</td>
          </tr>
          <tr>
            <td class={ month === 4 ? 'current' : '' }>4月</td>
            <td class={ month === 5 ? 'current' : '' }>5月</td>
            <td class={ month === 6 ? 'current' : '' }>6月</td>
          </tr>
          <tr>
            <td class={ month === 7 ? 'current' : '' }>7月</td>
            <td class={ month === 8 ? 'current' : '' }>8月</td>
            <td class={ month === 9 ? 'current' : '' }>9月</td>
          </tr>
          <tr>
            <td class={ month === 10 ? 'current' : '' }>10月</td>
            <td class={ month === 11 ? 'current' : '' }>11月</td>
            <td class={ month === 12 ? 'current' : '' }>12月</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class={ self.currentView === 'date' ? 'datepicker-footer' : 'datepicker-footer hidden' }>
        <button class="datepicker-todaybtn" onclick={ self.changeToToday.bind(self) }>Today</button>
      </div>
    </div>);
  }
}

module.exports = DatePicker;
