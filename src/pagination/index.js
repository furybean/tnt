require('./index.css');

var Pagination = function() {
};

Pagination.prototype.render = function(parent) {
  if (!parent) parent = document.body;
  var element = document.createElement('div');
  element.className = 'pagination';
  element.innerHTML = 'pagination';
  parent.appendChild(element);
};

module.exports = Pagination;
