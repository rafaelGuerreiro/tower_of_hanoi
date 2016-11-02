;(function($, document, window, undefined) {
  'use strict';

  var MAX_TILES = 9;

  var game = [[], [], []];
  var activeTile = null;

  var queue = [];
  var animating = false;

  $.game = {
    initialize: _initialize,
    play: _play
  };

  $('.tiles-amount').on('change', _initializeGame);

  (function init() {
    var options = ['<option value="0">Select the size</option>'];
    for (var amount = 3; amount <= MAX_TILES; amount++) {
      options.push('<option value="');
      options.push(amount);
      options.push('">');
      options.push(amount);
      options.push(' tiles</option>');
    }

    $('.tiles-amount').get(0).setInnerHtml(options.join(''));
  })();

  // functions
  function _initializeGame() {
    _initialize(this.val());
  }

  function _initialize(amount) {
    amount = Number(amount);
    if (isNaN(amount) || amount > 9 || amount < 3)
      return;

    _reset();

    for (var tile = 0; tile < amount; tile++)
      game[0].splice(tile, 0, {
        tile: tile,
        column: 0
      });

    _draw();
  }

  function _reset() {
    game = [[], [], []];
    activeTile = null;

    $.drawing.clear();
  }

  function _draw() {
    $.drawing.draw(game, activeTile);
  }

  function _play(index) {
    if (typeof index !== 'number' || index > 2 || index < 0)
      return;

    _queue(index);
  }

  function _queue(index) {
    if (animating)
      queue.push(index);
    else
      _invokeAction(index);
  }

  function _invokeAction(index) {
    if (!activeTile)
      _activateTile(index);
    else if (activeTile.column === index)
      _unselectTile();
    else
      _moveTileTo(index);
  }

  function _activateTile(index) {
    var tile = game[index][0];
    if (!tile)
      return;

    _animate($.drawing.selectTile, tile.tile, function() {
      activeTile = tile;
    });
  }

  function _unselectTile() {
    _animate($.drawing.unselectTile, activeTile.tile, function() {
      activeTile = null;
    });
  }

  function _moveTileTo(index) {
    if (!_isAbleToMove(index))
      return;

    _animate($.drawing.moveTileTo, index, activeTile.tile, function() {
      game[activeTile.column].remove(activeTile);
      game[index].splice(0, 0, activeTile);

      activeTile.column = index;
      _unselectTile();
    });
  }

  function _animate(fn) {
    if (typeof fn !== 'function')
      return;

    var args = Array.prototype.slice.call(arguments, 1);

    var callback = args[args.length - 1];
    if (typeof callback === 'function')
      args[args.length - 1] = _animationCallback(callback);
    else
      args.push(_animationCallback());

    animating = true;
    fn.apply(undefined, args);

    function _animationCallback(otherCallback) {
      return function() {
        if (typeof callback === 'function')
          otherCallback();

        animating = false;
        _invokeNext();
      };
    }
  }

  function _invokeNext() {
    if (queue.length === 0)
      return;

    _invokeAction(queue.shift());
  }

  function _isAbleToMove(index) {
    var column = game[index];

    if (column.length === 0)
      return true;

    return activeTile.tile < column[0].tile;
  }
})($, document, window);