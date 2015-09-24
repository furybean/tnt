require('./index.css');

var Pagination = function(listData, itemPerPage) {
  var pageCount = Math.ceil(listData.length / itemPerPage);
  var list = [];

  var resetUl = function(newList) {
    for (var i =0, len = ul.childNodes.length; i < len; i++) {
      ul.removeChild(ul.childNodes[0]);
    }
    for (i = 0, len = newList.length; i < len; i++) {
      ul.appendChild(newList[i]);
    }
  }

  var updateState = function (currentPage) {
    var newList = [];
    var flag = [];
    if (pageCount < 6) {
      for (var i = 0; i < pageCount; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(i + 1));
        newList.push(li);
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
        } else if (flag[i] === '<') {
          if (currentPage > 1) {
            li.addEventListener('click', function() {
              updateState(currentPage - 1);
            });
          }
        } else if (flag[i] === '>') {
          if (currentPage < pageCount) {
            li.addEventListener('click', function() {
              updateState(currentPage + 1);
            });
          }

        } else if (parseInt(flag[i]) !== currentPage) {
          li.addEventListener('click', function() {
            updateState(parseInt(this.innerHTML));
          });
        }
        newList.push(li);
      }
    }
    for (var i = 0, len = newList.length; i < len; i++) {
      if (newList[i].className === "active") {
        newList[i].className = "";
      }
      if (parseInt(newList[i].innerHTML) === currentPage) {
        newList[i].className = "active";
      }
    }
    resetUl(newList);
  }

  var ul = document.createElement("ul");
  updateState(1);
  this.ul = ul;
};

Pagination.prototype.render = function(parent) {
  if (!parent) parent = document.body;
  var element = document.createElement('div');
  element.className = 'pagination';
  element.appendChild(this.ul);
  parent.appendChild(element);
};

module.exports = Pagination;
