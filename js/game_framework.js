// This is a custom made framework just to make the development less verbose.
;(function(document, window, undefined) {
  'use strict';

  Array.prototype.each = _each;
  Array.prototype.map = _map;
  Array.prototype.flatten = _flatten;
  Array.prototype.reduce = _reduce;
  Array.prototype.remove = _remove;

  var $ = _querySelectorAll;

  $.isEmpty = _isEmpty;
  $.isPresent = _isPresent;
  $.isStringPresent = _isStringPresent;
  $.isFunction = _isFunction;

  window.$ = $;

  var $body = new GameNode(document.body);

  // Main functions
  function _querySelectorAll(selector, parent) {
    if (_isEmpty(selector))
      return new GameNodes();

    if (_isEmpty(parent) && (selector instanceof GameNodes || selector instanceof GameNode))
      return new GameNodes(selector);

    if (parent instanceof GameNodes || parent instanceof GameNode)
      return parent.find(selector);

    if (_isStringPresent(parent))
      return $body.find(parent).find(selector);

    return $body.find(selector);
  }

  // Helper functions
  function _isEmpty(value) {
    if (!value)
      return true;

    if (typeof value === 'string')
      value = value.trim();

    return !value;
  }

  function _isPresent(value) {
    return !_isEmpty(value);
  }

  function _isStringPresent(value) {
    return typeof value === 'string' && _isPresent(value);
  }

  function _isFunction(fn) {
    return _isPresent(fn) && typeof fn === 'function';
  }

  // Objects improvement
  function _each(callback) {
    if (!_isFunction(callback))
      return this;

    for (var index = 0; index < this.length; index++) {
      var response = callback.call(this[index], index, this);
      if (response === false)
        break;
    }

    return this;
  }

  function _map(callback) {
    if (!_isFunction(callback))
      callback = function() { return this; };

    var map = [];
    for (var index = 0; index < this.length; index++)
      map.push(callback.call(this[index], index, this));

    return map;
  }

  function _live(event, selector, callback) {
    if (!_isFunction(callback))
      return this;

    return this.each(function() {
      var parent = this;

      this.node.addEventListener(event, function(e) {
        console.log(e);

        var target = new GameNode(e.target);
        if (!target.matches(selector))
          return;

        var response = callback.call(target, e, parent);
        if (response === false) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
  }

  function _find(selector) {
    if (_isEmpty(selector))
      return new GameNodes();

    if (this instanceof GameNode)
      return new GameNodes(this.node.querySelectorAll(selector));

    return new GameNodes(this.map(function() {
      return this.find(selector);
    }));
  }

  function _get(index) {
    if (typeof index !== 'number')
      return this;

    index = index % this.length;

    if (index < 0)
      index = this.length + index;

    return new GameNodes(this[index]);
  }

  function _match(selector) {
    if (!_isStringPresent(selector))
      return false;

    var match = true;
    this.each(function() {
      return match && this.matches(selector);
    });

    return match;
  }

  function _matches(selector) {
    if (!_isStringPresent(selector))
      return false;

    var fn = this.node.matches ||
      this.node.webkitMatchesSelector ||
      this.node.mozMatchesSelector ||
      this.node.msMatchesSelector ||
      this.node.oMatchesSelector;

    return fn.call(this.node, selector);
  }

  function _flatten() {
    if (this instanceof GameNodes)
      return this.map().flatten();

    return this.reduce(function (flat, toFlatten) {
      var val = toFlatten;
      if (_isFunction(toFlatten.flatten))
        val = toFlatten.flatten();

      return flat.concat(val);
    }, []);
  }

  function _reduce(callback, value) {
    if (value === undefined)
      return undefined;

    if (!_isFunction(callback))
      return value;

    for (var index = 0; index < this.length; index++) {
      value = callback(value, this[index], index, this);
    }

    return value;
  }

  function _remove(/* value1, value2 */) {
    if (arguments.length === 0)
      return this;

    for (var ix = 0; ix < arguments.length; ix++) {
      var value = arguments[ix];

      for (var index = 0; index < this.length; index++)
        if (value === this[index])
          this.splice(index, 1);
    }

    return this;
  }

  function _filter(selector) {
    if (!_isStringPresent(selector))
      return this;

    var filter = [];
    this.each(function() {
      if (this.matches(selector))
        filter.add(this);
    });

    return new GameNodes(filter);
  }

  function _addClass(classes) {
    if (!_isStringPresent(classes))
      return this;

    if (this instanceof GameNode) {
      var toAdd = _processClassNames(classes);

      this.styleNames.each(function() {
        toAdd.remove(this);
      });
      if (toAdd.length > 0)
        this.styleNames.push(toAdd);

      return _updateClassNames.call(this);
    }

    return this.each(function() {
      this.addClass(classes);
    });
  }

  function _removeClass(classes) {
    if (!_isStringPresent(classes))
      return this;

    if (this instanceof GameNode) {
      var toRemove = _processClassNames(classes);
      var obj = this;

      toRemove.each(function() {
        obj.styleNames.remove(this);
      });

      return _updateClassNames.call(this);
    }

    return this.each(function() {
      this.removeClass(classes);
    });
  }

  function _toggleClass(classes) {
    if (!_isStringPresent(classes))
      return this;

    if (this instanceof GameNode) {
      var toToggle = _processClassNames(classes);
      var obj = this;

      toToggle.each(function() {
        if (obj.hasClass(this))
          obj.removeClass(this);
        else
          obj.addClass(this);
      });
    }

    return this.each(function() {
      this.toggleClass(classes);
    });
  }

  function _hasClass(classes) {
    if (!_isStringPresent(classes))
      return false;

    if (this instanceof GameNode) {
      var toVerify = _processClassNames(classes);
      var obj = this;

      return toVerify.reduce(function(hasClass, className) {
        return hasClass && obj.styleNames.indexOf(className) > -1;
      }, true);
    }

    return this.map(function() {
        return this.toggleClass(classes);
      }).reduce(function(hasClass, eachVal) {
        return hasClass && eachVal;
      });
  }

  function _processClassNames(classes) {
    return classes.toLowerCase().split(/\s+/g);
  }

  function _updateClassNames() {
    this.node.className = this.styleNames.join(' ');
    return this;
  }

  function _toNodesList(nodes) {
    if (!nodes)
      nodes = [];

    if (nodes instanceof NodeList)
      return nodes;

    if (nodes instanceof Array || nodes instanceof GameNodes)
      return nodes.flatten();

    return [nodes].flatten();
  }

  // Classes
  function GameNodes(nodes) {
    var elements = _toNodesList(nodes);

    this.length = elements.length;
    this.each = _each;
    this.map = _map;
    this.live = _live;
    this.get = _get;
    this.find = _find;
    this.match = _match;
    this.flatten = _flatten;
    this.filter = _filter;

    for (var index = 0; index < elements.length; index++) {
      var el = elements[index];
      if (el instanceof GameNode)
        el = el.node;

      this[index] = new GameNode(el);
    }
  }

  function GameNode(node) {
    this.node = node;
    this.matches = _matches;
    this.find = _find;

    this.styleNames = [];

    this.addClass = _addClass;
    this.removeClass = _removeClass;
    this.toggleClass = _toggleClass;
    this.hasClass = _hasClass;

    this.addClass(node.className);
  }
})(document, window);