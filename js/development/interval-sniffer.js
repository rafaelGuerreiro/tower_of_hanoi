;(function(window) {
  'use strict';

  // Intercepts setInterval and clearInterval just to check if there's any
  // interval left running without clearing it.

  var originalSetInterval = window.setInterval;
  var originalClearInterval = window.clearInterval;

  window.setInterval = _setIntervalInterceptor;
  window.clearInterval = _clearIntervalInterceptor;
  window.getIntervals = _getIntervals;

  var active = [];

  function _setIntervalInterceptor(fn, delay) {
    var id = originalSetInterval(fn, delay);

    active.push(new InterceptedInterval(id, fn, delay));
    return id;
  }

  function _clearIntervalInterceptor(id) {
    _remove(id);
    return originalClearInterval(id);
  }

  function _remove(id) {
    for(var index = 0; index < active.length; index++)
      if (active[index].id === id) {
        active.splice(index, 1);
        return;
      }
  }

  function _getIntervals() {
    return active;
  }

  function InterceptedInterval(id, fn, delay) {
    this.id = id;
    this.fn = fn;
    this.delay = delay;
  }

  InterceptedInterval.prototype.toString = function() {
    return [this.id, this.delay].join(': ');
  };
})(window);