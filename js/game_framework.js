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

    if (selector instanceof Node || selector instanceof NodeList)
      return new GameNodes(selector);

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

    var events = event.split(/\s+/g);

    if (this instanceof GameNode)
      return _invoke.call(this, events, selector, callback, _invokeLive);

    return this.each(function() {
      _invoke.call(this, events, selector, callback, _invokeLive);
    });
  }

  function _invoke(events, selector, callback, invocationType) {
    var that = this;
    var node = that.node;

    events.each(function() {
      node.addEventListener(this, function(event) {
        invocationType.call(that, event, selector, callback);
      });
    });

    return this;
  }

  function _invokeLive(event, selector, callback) {
    var target = new GameNode(event.target);
    _bubbleUp(target, selector, callback, event, this);
  }

  function _on(events, selector, callback) {
    if (!_isFunction(callback))
      return this;

    var events = event.split(/\s+/g);

    if (this instanceof GameNode)
      return _invoke.call(this, events, selector, callback, _invokeOn);

    return this.each(function() {
      _invoke.call(this, events, selector, callback, _invokeOn);
    });
  }

  function _invokeOn(event, selector, callback) {
    _invokeEventCallback(this, callback, event, this);
  }

  function _bubbleUp(target, selector, callback, e, eventAttachedOn) {
    if (!target.matches(selector)) {
      if (target.matches('body'))
        return;

      return _bubbleUp(target.parent(), selector, callback, e, eventAttachedOn);
    }

    _invokeEventCallback(target, callback, e, eventAttachedOn);
  }

  function _invokeEventCallback(target, callback, e, eventAttachedOn) {
    var response = callback.call(target, e, eventAttachedOn);
    if (response === false) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function _closest(selector) {
    if (this instanceof GameNode) {
      if (!this.matches(selector)) {
        if (this.matches('body'))
          return new GameNodes();

        return this.parent().closest(selector);
      }

      return new GameNodes(this);
    }

    return new GameNodes(this.map(function() {
      return this.closest(selector);
    }));
  }

  function _find(selector) {
    if (!_isStringPresent(selector))
      selector = '*';

    if (this instanceof GameNode)
      return new GameNodes(this.node.querySelectorAll(selector));

    return new GameNodes(this.map(function() {
      return this.find(selector);
    }));
  }

  function _get(index) {
    if (typeof index !== 'number' || this.length === 0)
      return undefined;

    index = index % this.length;

    if (index < 0)
      index = this.length + index;

    return this[index];
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

    var fn = (this.node.matches ||
      this.node.webkitMatchesSelector ||
      this.node.mozMatchesSelector ||
      this.node.msMatchesSelector ||
      this.node.oMatchesSelector);

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

      return this;
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
    if (classes === undefined)
      return undefined;

    return classes.toLowerCase().split(/\s+/g);
  }

  function _updateClassNames() {
    this.node.className = this.styleNames.join(' ');
    return this;
  }

  function _parent() {
    return new GameNode(this.node.parentNode);
  }

  function _data(key, value) {
    if (this instanceof GameNode) {
      if (!_isStringPresent(key))
        return this._data;

      if (value === undefined)
        return this._data[key];

      return _setData.call(this, key, value);
    }

    return this.map(function() {
      return this.data(key, value);
    });
  }

  function _removeData(key) {
    if (this instanceof GameNode) {
      var data = this._data[key];
      if (data !== undefined)
        this._data[key] = undefined;

      return data;
    }

    return this.map(function() {
      return this.removeData(key);
    });
  }

  function _setData(key, value) {
    if (this instanceof GameNode) {
      if (!_isStringPresent(key))
        return undefined;

      if (value === undefined)
        return _removeData.call(this, key);

      _setDataAttribute(this.node, key, value);

      value = _convert(value);
      this._data[key] = value;
      return value;
    }

    return this.map(function() {
      return this.setData(key, value);
    });
  }

  function _convert(value) {
    if (typeof value !== 'string')
      return value;

    if (_isConvertibleToArray(value) || _isConvertibleToObject(value))
      return JSON.parse(value);

    if (_isConvertibleToBoolean(value))
      return (value === 'true');

    if (_isConvertibleToNumber(value))
      return Number(value);

    return value;
  }

  function _isConvertibleToArray(value) {
    return value.match(/^\[.*?\]$/g);
  }

  function _isConvertibleToObject(value) {
    return value.match(/^\{.*?\}$/g);
  }

  function _isConvertibleToBoolean(value) {
    return value.match(/^(true|false)$/g);
  }

  function _isConvertibleToNumber(value) {
    return value.match(/^[\+\-]?\d+\.?\d*$/g);
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

  function _getDataAttributes(node) {
    var list = node.attributes;

    if (list === undefined)
      return {};

    var data = {};
    for (var index = 0; index < list.length; index++) {
      var attr = list[index];
      if (attr.name.match(/^data\-[a-z0-9\-]*$/gi))
        data[_toKeyName(attr.name)] = _convert(attr.value);
    }

    return data;
  }

  function _setDataAttribute(node, key, value) {
    key = 'data-' + _toSnakeCase(key);

    if (typeof value === 'object' || Array.isArray(value))
      value = JSON.stringify(value);

    node.setAttribute(key, value);
  }

  function _toKeyName(name) {
    return _toCamelCase(name.substring('data-'.length));
  }

  function _toSnakeCase(str) {
    str = str.replace(/([A-Z]+)/g, '-$1');

    if (str.match(/^[\-].*$/g))
      str = str.substring(1);

    return str.toLowerCase();
  }

  function _toCamelCase(str) {
    var split = str.toLowerCase().split('-');

    if (split.length === 1)
      return split[0];

    for (var index = 1; index < split.length; index++)
      split[index] = _capitalize(split[index]);

    return split.join('');
  }

  function _capitalize(str) {
    if (str.length <= 1)
      return str.toUpperCase();

    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  function _append(/* node1, node2 */) {
    var length = arguments.length;
    if (length === 0)
      return this;

    var parent = this;
    for (var index = 0; index < length; index++) {
      var node = arguments[index];

      if (node instanceof GameNode)
        _appendSingle(parent, node);
      else if (node instanceof GameNodes)
        node.each(function() {
          _appendSingle(parent, this);
        });
    }

    return this;
  }

  function _appendSingle(parent, child) {
    parent.node.appendChild(child.node);
  }

  function _prepend(/* node1, node2 */) {
    var length = arguments.length;
    if (length === 0)
      return this;

    var parent = this;
    for (var index = length - 1; index >= 0; index--) {
      var node = arguments[index];

      if (node instanceof GameNode)
        _prependSingle(parent, node);
      else if (node instanceof GameNodes)
        node.each(function() {
          _prependSingle(parent, this);
        });
    }

    return this;
  }

  function _prependSingle(parent, child) {
    var children = parent.children();
    var node = null;
    if (children.length > 0)
      node = children.get(0).node;

    parent.node.insertBefore(child.node, node);
  }

  function _children(selector) {
    if (this instanceof GameNode) {
      if (!_isStringPresent(selector))
        selector = '*';

      var children = this.node.children || this.node.childNodes;

      var nodes = [];
      for (var index = 0; index < children.length; index++) {
        var node = new GameNode(children[index]);
        if (node.matches(selector))
          nodes.push(node);
      }

      return new GameNodes(nodes);
    }

    return new GameNodes(this.map(function() {
      return this.children(selector);
    }));
  }

  // Classes
  function GameNodes(nodes) {
    var elements = _toNodesList(nodes);

    this.length = elements.length;
    this.each = _each;
    this.map = _map;
    this.live = _live;
    this.on = _on;
    this.get = _get;
    this.find = _find;
    this.children = _children;
    this.match = _match;
    this.flatten = _flatten;
    this.filter = _filter;
    this.closest = _closest;

    this.addClass = _addClass;
    this.removeClass = _removeClass;
    this.toggleClass = _toggleClass;
    this.hasClass = _hasClass;

    this.data = _data;
    this.removeData = _removeData;
    this.setData = _setData;

    for (var index = 0; index < elements.length; index++) {
      var el = elements[index];
      if (el instanceof GameNode)
        el = el.node;

      this[index] = new GameNode(el);
    }
  }

  function GameNode(node) {
    this.node = node;
    this._data = _getDataAttributes(node);

    this.matches = _matches;
    this.find = _find;
    this.on = _on;
    this.children = _children;
    this.closest = _closest;

    this.styleNames = _processClassNames(node.className);

    this.addClass = _addClass;
    this.removeClass = _removeClass;
    this.toggleClass = _toggleClass;
    this.hasClass = _hasClass;
    this.parent = _parent;

    this.data = _data;
    this.removeData = _removeData;
    this.setData = _setData;

    this.prepend = _prepend;
    this.append = _append;
  }
})(document, window);