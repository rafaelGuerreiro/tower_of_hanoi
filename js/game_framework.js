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
  $.argumentsAsArray = _argumentsAsArray;

  $.log = _log;

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

  function _log(message) {
    if (console && typeof console.log === 'function')
      console.log(message);
  }

  // Helper functions
  function _argumentsAsArray(args) {
    return Array.prototype.slice.call(args, 0);
  }

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
      if (node instanceof Node)
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

  function _on(events, callback) {
    if (!_isFunction(callback))
      return this;

    var events = events.split(/\s+/g);

    if (this instanceof GameNode)
      return _invoke.call(this, events, undefined, callback, _invokeOn);

    return this.each(function() {
      _invoke.call(this, events, undefined, callback, _invokeOn);
    });
  }

  function _invokeOn(event, _selector, callback) {
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

  function _trigger(event) {
    if (!_isStringPresent(event))
      return this;

    if (this instanceof GameNode) {
      event = _createEvent(event);

       if (document.createEvent)
         this.node.dispatchEvent(event);
       else
         this.node.fireEvent("on" + event.eventType, event);

      return this;
    }

    return this.each(function() {
      this.trigger(event);
    });
  }

  function _createEvent(eventName) {
    var event;
    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = eventName;
    }
    event.eventName = eventName;

    return event;
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

    if (fn)
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
        filter.push(this);
    });

    return new GameNodes(filter);
  }

  function _addClass(classes) {
    if (!_isStringPresent(classes))
      return this;

    if (this instanceof GameNode) {
      var toAdd = _processClassNames(classes);
      var obj = this;

      obj.styleNames.each(function() {
        toAdd.remove(this);
      });

      if (toAdd.length > 0)
        toAdd.each(function() {
          obj.styleNames.push(this);
        });

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

  function _toggleClass(classes, condition) {
    if (!_isStringPresent(classes))
      return this;

    if (this instanceof GameNode) {
      var toToggle = _processClassNames(classes);
      var obj = this;

      var useCondition = condition === true || condition === false;

      toToggle.each(function() {
        var remove = obj.hasClass(this);
        if (useCondition) remove = !condition;

        if (remove)
          obj.removeClass(this);
        else
          obj.addClass(this);
      });

      return this;
    }

    return this.each(function() {
      this.toggleClass(classes, condition);
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
        return this.hasClass(classes);
      }).reduce(function(hasClass, eachVal) {
        return hasClass && eachVal;
      }, true);
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

    if (nodes instanceof GameNodes)
      return nodes.flatten();

    if (!Array.isArray(nodes))
      nodes = [nodes];

    var converted = [];
    for (var index = 0; index < nodes.length; index++) {
      var node = _toNode(nodes[index]);

      if (Array.isArray(node) || node instanceof NodeList)
        for (var ix = 0; ix < node.length; ix++)
          converted.push(node[ix]);
    }

    return converted;
  }

  function _toNode(node) {
    if (node instanceof Node)
      return [node];
    if (node instanceof NodeList)
      return node;
    if (node instanceof GameNode)
      return [node.node];
    if (node instanceof GameNodes)
      return node.flatten();

    if (_isEmpty(node))
      return undefined;

    var container = document.createElement('div');
    container.innerHTML = node;
    return container.childNodes;
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

  function _index() {
    var children = this.parent().children();
    var length = children.length;

    for (var index = 0; index < length; index++)
      if (children.get(index).node === this.node)
        return index;

    return -1;
  }

  function _append(/* node1, node2 */) {
    var args = _argumentsAsArray(arguments);
    if (this instanceof GameNode) {
      var length = args.length;
      if (length === 0)
        return this;

      var parent = this.node;
      new GameNodes(args).each(function() {
        parent.appendChild(this.node);
      });

      return this;
    }

    return this.each(function() {
      this.append.apply(this, args);
    });
  }

  function _prepend(/* node1, node2 */) {
    var args = _argumentsAsArray(arguments);
    if (this instanceof GameNode) {
      var length = args.length;
      if (length === 0)
        return this;

      var parent = this;
      new GameNodes(args).each(function() {
        _insertBeforeSingle(parent, this.node);
      });

      return this;
    }

    return this.each(function() {
      this.prepend.apply(this, args);
    });
  }

  function _insertBefore(/* node1, node2 */) {
    var args = _argumentsAsArray(arguments);
    if (this instanceof GameNode) {
      var length = args.length;
      if (length === 0)
        return this;

      var node = this;
      var parent = node.parent();
      new GameNodes(args).each(function() {
        _insertBeforeSingle(parent, this.node, node.index());
      });

      return this;
    }

    return this.each(function() {
      this.insertBefore.apply(this, args);
    });
  }

  function _insertBeforeSingle(parent, child, index) {
    var children = parent.children();
    var node = null;
    if (children.length > 0)
      node = children.get(index || 0).node;

    parent.node.insertBefore(child, node);
  }

  function _insertAfter(/* node1, node2 */) {
    var args = _argumentsAsArray(arguments);
    if (this instanceof GameNode) {
      var length = args.length;
      if (length === 0)
        return this;

      var node = this;
      var parent = node.parent();
      new GameNodes(args).each(function() {
        _insertAfterSingle(parent, this.node, node.index());
      });

      return this;
    }

    return this.each(function() {
      this.insertAfter.apply(this, args);
    });
  }

  function _insertAfterSingle(parent, child, index) {
    var children = parent.children();
    var node = null;
    if (children.length > 0)
      node = children.get(index || 0).node;

    parent.node.insertAfter(child, node);
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

  function _setInnerHtml(html) {
    if (this instanceof GameNode) {
      if (!_isStringPresent(html))
        html = '';

      this.node.innerHTML = html;
      return this;
    }

    return new GameNodes(this.map(function() {
      return this.setInnerHtml(html);
    }));
  }

  function _setInnerText(text) {
    if (this instanceof GameNode) {
      if (!_isStringPresent(text))
        text = '';

      this.node.innerText = '' + text;
      return this;
    }

    return new GameNodes(this.map(function() {
      return this.setInnerText(text);
    }));
  }

  function _val(value) {
    if (this instanceof GameNode) {
      if (value === undefined)
        return this.node.value;

      this.node.value = value;
      return this;
    }

    return new GameNodes(this.map(function() {
      return this.val(value);
    }));
  }

  function _removeNode() {
    if (this instanceof GameNode) {
      this.node.remove();
      return this;
    }

    return this.each(function() {
      this.remove();
    });
  }

  function _focus() {
    if (this instanceof GameNode) {
      this.node.focus();
      return this;
    }

    if (this.length > 0)
      this[0].focus();

    return this;
  }

  function _blur() {
    if (this instanceof GameNode) {
      this.node.blur();
      return this;
    }

    if (this.length > 0)
      this[0].focus();

    return this;
  }

  function _attr(attr, value) {
    if (this instanceof GameNode) {
      if (value === false) {
        this.node.removeAttribute(attr);
      } else {
        if (value === true)
          value = attr;

        this.node.setAttribute(attr, value);
      }
      return this;
    }

    return this.each(function() {
      this.attr(attr, value);
    });
  }

  function _style(name, value) {
    if (this instanceof GameNode) {
      var style = window.getComputedStyle(this.node);

      if (_isEmpty(value))
        return style.getPropertyValue(name);

      if (!isNaN(value))
        value += 'px';

      this.node.style[name] = value;
      return this;
    }

    if (_isEmpty(value))
      return this.map(_callStyle);

    return this.each(_callStyle);

    function _callStyle() {
      return this.style(name, value);
    }
  }

  function _removeStyle(name) {
    if (this instanceof GameNode) {
      this.node.style[name] = '';
      return this;
    }

    return this.each(function() {
      this.removeStyle(name);
    });
  }

  function _getBoundingClientRect(property) {
    if (this instanceof GameNode) {
      var rect = this.node.getBoundingClientRect();
      if (_isStringPresent(property))
        return rect[property];

      return rect;
    }

    return this.map(function() {
      return this.getBoundingClientRect(property);
    });
  }

  // Classes
  function GameNodes(nodes) {
    var elements = _toNodesList(nodes);

    this.length = elements.length;

    for (var index = 0; index < elements.length; index++) {
      var el = elements[index];
      if (el instanceof GameNode)
        el = el.node;

      this[index] = new GameNode(el);
    }
  }

  GameNodes.prototype.each = _each;
  GameNodes.prototype.map = _map;
  GameNodes.prototype.live = _live;
  GameNodes.prototype.on = _on;
  GameNodes.prototype.trigger = _trigger;
  GameNodes.prototype.get = _get;
  GameNodes.prototype.find = _find;
  GameNodes.prototype.children = _children;
  GameNodes.prototype.match = _match;
  GameNodes.prototype.flatten = _flatten;
  GameNodes.prototype.filter = _filter;
  GameNodes.prototype.closest = _closest;

  GameNodes.prototype.val = _val;

  GameNodes.prototype.addClass = _addClass;
  GameNodes.prototype.removeClass = _removeClass;
  GameNodes.prototype.toggleClass = _toggleClass;
  GameNodes.prototype.hasClass = _hasClass;

  GameNodes.prototype.data = _data;
  GameNodes.prototype.removeData = _removeData;
  GameNodes.prototype.setData = _setData;

  GameNodes.prototype.prepend = _prepend;
  GameNodes.prototype.insertBefore = _insertBefore;
  GameNodes.prototype.insertAfter = _insertAfter;
  GameNodes.prototype.append = _append;

  GameNodes.prototype.remove = _removeNode;

  GameNodes.prototype.setInnerHtml = _setInnerHtml;
  GameNodes.prototype.setInnerText = _setInnerText;

  GameNodes.prototype.focus = _focus;
  GameNodes.prototype.blur = _blur;
  GameNodes.prototype.attr = _attr;
  GameNodes.prototype.style = _style;
  GameNodes.prototype.removeStyle = _removeStyle;

  GameNodes.prototype.getBoundingClientRect = _getBoundingClientRect;

  function GameNode(node) {
    this.node = node;
    this._data = _getDataAttributes(node);
    this.styleNames = _processClassNames(node.className);
  }

  GameNode.prototype.matches = _matches;
  GameNode.prototype.find = _find;
  GameNode.prototype.live = _live;
  GameNode.prototype.on = _on;
  GameNode.prototype.trigger = _trigger;
  GameNode.prototype.children = _children;
  GameNode.prototype.closest = _closest;

  GameNode.prototype.val = _val;

  GameNode.prototype.addClass = _addClass;
  GameNode.prototype.removeClass = _removeClass;
  GameNode.prototype.toggleClass = _toggleClass;
  GameNode.prototype.hasClass = _hasClass;
  GameNode.prototype.parent = _parent;

  GameNode.prototype.data = _data;
  GameNode.prototype.removeData = _removeData;
  GameNode.prototype.setData = _setData;

  GameNode.prototype.index = _index;

  GameNode.prototype.prepend = _prepend;
  GameNode.prototype.insertBefore = _insertBefore;
  GameNode.prototype.insertAfter = _insertAfter;
  GameNode.prototype.append = _append;

  GameNode.prototype.remove = _removeNode;

  GameNode.prototype.setInnerHtml = _setInnerHtml;
  GameNode.prototype.setInnerText = _setInnerText;

  GameNode.prototype.focus = _focus;
  GameNode.prototype.blur = _blur;
  GameNode.prototype.attr = _attr;
  GameNode.prototype.style = _style;
  GameNode.prototype.removeStyle = _removeStyle;

  GameNode.prototype.getBoundingClientRect = _getBoundingClientRect;
})(document, window);