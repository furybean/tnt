require('./index.css');

class Pagination { 
  constructor(options) {
    this.currentPage = 1;
    this.pageCount = 0;

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  updateState(currentPage, pageCount, ul) {
    this.resetUl(ul);
    var self = this;
    var newList = [];
    var flag = [];
    var newPage = 0;
    var bindEvent = function(i, li) {
      if (li.innerHTML !== '...') {
        li.addEventListener('click', function() {
          newPage = 0;
          if (this.innerHTML === '&lt;') {
            if (currentPage > 1) {
              newPage = currentPage - 1;
            }
          } else if (this.innerHTML === '&gt;') {
            if (currentPage < pageCount) {
              newPage = currentPage + 1;
            }
          } else if (parseInt(this.innerHTML) !== currentPage) {
            newPage = parseInt(this.innerHTML);
          }
          if (newPage !== 0) {
            self.updateState(newPage, self.pageCount, ul);
            if (self.onChange) {
              self.onChange(newPage);
            }
          }
        })
      }
    };
    if (pageCount < 6) {
      for (var i = 0; i < pageCount; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(i + 1));
        newList.push(li);
        bindEvent(i ,li);
      }
    } else {
      if (currentPage <= 3) {
        flag = ["<", "1", "2", "3", "4", "...", pageCount.toString(), ">"];
      } else if (currentPage >= pageCount - 2) {
        flag = ["<", "1", "...", (pageCount - 3).toString(), (pageCount - 2).toString(), (pageCount - 1).toString(), pageCount.toString(), ">"];
      } else {
        flag = ["<", "1", "..."];
        for (i = -1; i < 2; i++) {
          flag.push((currentPage + i).toString());
        }
        flag.push("...");
        flag.push(pageCount.toString());
        flag.push(">");
      }
      for (var len = flag.length, i = 0; i < len; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(flag[i]));
        if (flag[i] === '...') {
          li.className = "ellipsis";
        }
        newList.push(li);
        bindEvent(i, li);
      }
    }
    
    for (var i = 0, len = newList.length; i < len; i++) {
      if (newList[i].className === "active") {
        newList[i].className = "";
      }
      if (parseInt(newList[i].innerHTML) === currentPage) {
        newList[i].className = "active";
      }
      ul.appendChild(newList[i]);
    }
  };

  resetUl(ul) {
    for (var i = 0, len = ul.childNodes.length; i < len; i++) {
      ul.removeChild(ul.childNodes[0]);
    }
  }

  init() {
    var ul = document.createElement("ul");
    this.updateState(this.currentPage, this.pageCount, ul);
    return ul;
  }

  render(parent) {
    if (!parent) parent = document.body;
    var element = document.createElement('div');
    element.className = 'pagination';
    element.appendChild(this.init());
    parent.appendChild(element);
  }
};

module.exports = Pagination;
