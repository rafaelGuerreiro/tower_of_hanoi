;(function($, document, window, undefined) {
  'use strict';

  var $timer = $('.timer').get(0);

  var time = 0;
  var steps = 25;

  var interval = null;

  (function initialize() {
    $.game.listen('play', _start)
      .listen('pause', _pause);
  })();

  // functions
  function _start() {
    if (interval !== null)
      return;

    var _updateTimer = _getUpdateTimer;

    _updateTimer();
    interval = setInterval(_updateTimer, steps);
  }

  function _pause() {
    if (interval === null)
      return;

    clearInterval(interval);
    interval = null;
  }

  function _getUpdateTimer() {
    $timer.setInnerText(_beautify(time));
    time += steps;
  }

  function _beautify(millisecond) {
    var millis = _zeroLeft(3, millisecond % 1000);
    var second = _zeroLeft(2, Math.floor(millisecond / 1000) % 60);
    var minute = _zeroLeft(2, Math.floor((millisecond / 1000) / 60));

    return [minute, ':', second, '.', millis].join('');
  }

  function _zeroLeft(left, number) {
    if ((number >= 100 && left === 3) || (number >= 10 && left === 2))
      return number;

    var padding = left - ("" + number).length;
    number = [number];

    for (var zero = 0; zero < padding; zero++)
      number.splice(0, 0, '0');

    return number.join('');
  }
})($, document, window);