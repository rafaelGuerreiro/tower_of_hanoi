// This is a custom made framework just to make the development less verbose.
;(function(document, window, undefined) {
  'use strict';

  var EMPTY_NODES = toNodesList();

  Array.prototype.each = each;
  Array.prototype.map = map;

  var $ = querySelectorAll;

  $.isEmpty = isEmpty;
  $.isPresent = isPresent;
  $.isStringPresent = isStringPresent;
  $.isFunction = isFunction;

  window.$ = $;

  // Main functions
  function querySelectorAll(selector, parent) {
    if (isEmpty(selector))
      return EMPTY_NODES;

    if (isStringPresent(parent))
      return toNodesList(querySelectorAll(parent).map(function() {
        return querySelectorAll(this, selector);
      }));

    return toNodesList(document.querySelectorAll(selector));
  }

  function toNodesList(nodes) {
    if (!nodes)
      nodes = [];

    return Array.isArray(nodes) ? nodes : [nodes];
  }

  // Helper functions
  function isEmpty(value) {
    if (!value)
      return true;

    if (typeof value === 'string')
      value = value.trim();

    return !value;
  }

  function isPresent(value) {
    return !isEmpty(value);
  }

  function isStringPresent(value) {
    return typeof value === 'string' && isPresent(value);
  }

  function isFunction(fn) {
    return isPresent(fn) && typeof fn === 'function';
  }

  // Objects improvement
  function each(callback) {
    if (!isFunction(callback))
      return this;

    for (var index = 0; index < this.length; index++) {
      var response = callback.call(this[index], index, this);

      if (response === false)
        break;
    }

    return this;
  }

  function map(callback) {
    if (!isFunction(callback))
      return [];

    var map = [];
    for (var index = 0; index < this.length; index++)
      map.push(callback.call(this[index], index, this));

    return map;
  }
})(document, window);